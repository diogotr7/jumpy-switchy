import { Scene } from "phaser";
import { AnalogInput } from "../utils/AnalogInput";
import { Player } from "../entities/Player";
import { JumpPreview } from "../entities/JumpPreview";
import { LevelManager } from "../managers/LevelManager";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;

  // Game components
  analogInput: AnalogInput;
  player: Player;
  jumpPreview: JumpPreview;
  levelManager: LevelManager;
  platforms: Phaser.Physics.Arcade.StaticGroup;

  // Level end zone
  endPosition: { x: number; y: number };
  endTriggerActive: boolean = false;

  // UI elements
  debugText: Phaser.GameObjects.Text;
  instructionsText: Phaser.GameObjects.Text;
  levelText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  init(data: { level?: number }) {
    // Get level from data or use level 0
    const levelIndex = data.level || 0;

    // Store the level in registry for game over
    this.registry.set("currentLevel", levelIndex);
    this.endTriggerActive = false;
  }

  preload() {
    // Load game specific assets
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/platform.png");
  }

  create() {
    this.camera = this.cameras.main;

    // Get the analog input system from registry
    this.analogInput = this.registry.get("analogInput") || new AnalogInput();

    // Create level manager
    this.levelManager = new LevelManager(this);

    // Set current level
    const levelIndex = this.registry.get("currentLevel") || 0;
    this.levelManager.setLevel(levelIndex);

    // Get current level data
    const levelData = this.levelManager.getCurrentLevelData();

    // Create layered background
    // Base background
    this.background = this.add.image(512, 384, levelData.background.base);
    this.background.setScale(
      1024 / this.background.width,
      768 / this.background.height
    );
    this.background.setAlpha(1);

    // Tiles layer (behind hills)
    const tiles = this.add.image(512, 384, levelData.background.tiles);
    tiles.setScale(1024 / tiles.width, 768 / tiles.height);
    tiles.setAlpha(0.9);

    // Hills layer (on top of tiles)
    const hills = this.add.image(512, 384, levelData.background.hills);
    hills.setScale(1024 / hills.width, 768 / hills.height);
    hills.setAlpha(0.8);

    // Create the level
    this.platforms = this.levelManager.createLevel();

    // Get player start position
    const startPos = this.levelManager.getPlayerStartPosition();
    // Get end position
    this.endPosition = this.levelManager.getEndPosition();

    // Create player at start position
    this.player = new Player(
      this,
      startPos.x,
      startPos.y,
      "player",
      this.analogInput
    );

    // Create jump preview
    this.jumpPreview = new JumpPreview(this, this.player);

    // Add collisions
    this.physics.add.collider(this.player, this.platforms);

    // Setup camera to follow player
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
    this.cameras.main.setFollowOffset(0, 0);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setDeadzone(0, 200);
    this.cameras.main.setBounds(0, 0, 1024, 768);
    this.cameras.main.setScroll(0, 0);

    this.createInstructions();

    // Add level display
    this.createLevelText();

    // Add keyboard input for level switching (for testing)
    this.input.keyboard?.on("keydown-N", () => {
      this.nextLevel();
    });
  }

  update(time: number, delta: number) {
    // Update player
    this.player.update(time, delta);

    // Update jump preview
    this.jumpPreview.update();

    // Check for level completion (reaching the end trigger)
    this.checkLevelCompletion();

    // Check if player fell off the level
    if (this.player.y > 800) {
      this.restartLevel();
    }
  }

  private checkLevelCompletion(): void {
    // Only check if we have a valid end position and haven't already triggered completion
    if (this.endPosition.x && this.endPosition.y && !this.endTriggerActive) {
      const endTriggerRadius = 50; // Size of the invisible trigger zone

      // Calculate distance from player to end trigger
      const dx = this.player.x - this.endPosition.x;
      const dy = this.player.y - this.endPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If player is close enough to the end trigger
      if (distance < endTriggerRadius) {
        this.endTriggerActive = true;
        this.showLevelCompleteMessage();

        // Wait a moment before moving to next level
        this.time.delayedCall(1500, () => {
          this.nextLevel();
        });
      }
    }

    // Fallback for levels without end triggers (or for testing)
    // Check if player reached the top platform (near where the end usually is)
    if (this.player.y < 50) {
      this.nextLevel();
    }
  }

  private showLevelCompleteMessage(): void {
    const levelCompleteText = this.add
      .text(512, 300, "Level Complete!", {
        fontFamily: "Arial",
        fontSize: "48px",
        backgroundColor: "#00000080",
        padding: { x: 20, y: 10 },
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);

    // Add a simple animation
    this.tweens.add({
      targets: levelCompleteText,
      scale: 1.2,
      duration: 500,
      yoyo: true,
      repeat: 1,
    });
  }

  private restartLevel(): void {
    // Restart the current level
    const currentLevel = this.registry.get("currentLevel") || 0;
    this.scene.restart({ level: currentLevel });
  }

  private nextLevel(): void {
    const currentLevel = this.registry.get("currentLevel") || 0;
    const nextLevel = currentLevel + 1;

    // Check if there are more levels
    if (nextLevel < this.levelManager.getTotalLevels()) {
      // Start next level
      this.scene.restart({ level: nextLevel });
    } else {
      // Player has completed all levels, return to main menu
      this.scene.start("MainMenu");
    }
  }

  private createInstructions() {
    this.instructionsText = this.add
      .text(100, 40, "A/D: Move\n" + "Space: Charge Jump\n" + "N skip level", {
        fontFamily: "Arial",
        fontSize: "18px",
        backgroundColor: "#00000080",
        padding: { x: 10, y: 5 },
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);
  }

  private createLevelText() {
    const level = this.registry.get("currentLevel") || 0;

    this.levelText = this.add
      .text(
        1024 - 65,
        25,
        `Level ${level + 1}/${this.levelManager.getTotalLevels()}`,
        {
          fontFamily: "Arial",
          fontSize: "24px",
          backgroundColor: "#00000080",
          padding: { x: 10, y: 5 },
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);
  }
}
