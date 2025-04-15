import { Scene } from "phaser";
import { AnalogInput } from "../utils/AnalogInput";
import { Player } from "../entities/Player";
import { JumpPreview } from "../entities/JumpPreview";
import { LevelManager } from "../managers/LevelManager";
import { GRID_SIZE, GRID_HEIGHT, GRID_WIDTH } from "../data/LevelData";

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

    // Calculate world dimensions based on grid size
    const worldWidth = GRID_WIDTH * GRID_SIZE;
    const worldHeight = GRID_HEIGHT * GRID_SIZE;

    // Set physics world bounds
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // Create layered background
    // Calculate the visible world height (don't extend too far below ground)
    const visibleWorldHeight = (GRID_HEIGHT - 0.5) * GRID_SIZE;

    // Base background
    this.background = this.add.image(
      worldWidth / 2,
      visibleWorldHeight / 2,
      levelData.background.base
    );
    this.background.setScale(
      worldWidth / this.background.width,
      visibleWorldHeight / this.background.height
    );
    this.background.setAlpha(1);

    // Tiles layer (behind hills)
    const tiles = this.add.image(
      worldWidth / 2,
      visibleWorldHeight / 2,
      levelData.background.tiles
    );
    tiles.setScale(worldWidth / tiles.width, visibleWorldHeight / tiles.height);
    tiles.setAlpha(0.9);

    // Hills layer (on top of tiles)
    const hills = this.add.image(
      worldWidth / 2,
      visibleWorldHeight / 2,
      levelData.background.hills
    );
    hills.setScale(worldWidth / hills.width, visibleWorldHeight / hills.height);
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

    // Setup camera to follow player with improved configuration for taller levels
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 0, 180);

    // Increase deadzone vertical size for smoother vertical scrolling
    // Make the deadzone taller on the bottom to see more of what's below
    this.cameras.main.setDeadzone(100, 300);

    // Calculate the ground position (last row)
    const groundY = (GRID_HEIGHT - 1) * GRID_SIZE;

    // Set camera bounds to match the world but don't go below the ground
    // We set the height to be the ground position plus an offset to show the ground tiles
    this.cameras.main.setBounds(0, 0, worldWidth, groundY + GRID_SIZE);
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
  }

  private showLevelCompleteMessage(): void {
    // Display level complete message at camera center instead of world center
    const levelCompleteText = this.add
      .text(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y - 100,
        "Level Complete!",
        {
          fontFamily: "Arial",
          fontSize: "48px",
          backgroundColor: "#00000080",
          padding: { x: 20, y: 10 },
          color: "#ffffff",
          align: "center",
        }
      )
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
