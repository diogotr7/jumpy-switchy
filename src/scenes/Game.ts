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
  }

  preload() {
    // Load game specific assets
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/platform.png");
  }

  create() {
    this.camera = this.cameras.main;

    // Add background
    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    // Get the analog input system from registry
    this.analogInput = this.registry.get("analogInput") || new AnalogInput();

    // Create level manager
    this.levelManager = new LevelManager(this);

    // Set current level
    const levelIndex = this.registry.get("currentLevel") || 0;
    this.levelManager.setLevel(levelIndex);

    // Create the level
    this.platforms = this.levelManager.createLevel();
    this.levelManager.createWalls();

    // Create player (centered on ground)
    this.player = new Player(this, 512, 700, "player", this.analogInput);

    // Create jump preview
    this.jumpPreview = new JumpPreview(this, this.player);

    // Add collisions
    this.physics.add.collider(this.player, this.platforms);

    // Setup camera to follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(100, 200);

    // Add debug display
    this.createDebugDisplay();

    // Add instruction text
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

    // Update debug display
    this.updateDebugDisplay();

    // Check for game over (falling off the bottom)
    if (this.player.y > this.cameras.main.scrollY + 900) {
      this.scene.start("GameOver", {
        level: this.registry.get("currentLevel"),
      });
    }

    // Check for level completion (reaching the top platform)
    if (this.player.y < 50) {
      this.nextLevel();
    }
  }

  private nextLevel(): void {
    const currentLevel = this.registry.get("currentLevel") || 0;
    const nextLevel = currentLevel + 1;

    // Check if there are more levels
    if (nextLevel < this.levelManager.getTotalLevels()) {
      // Start next level
      this.scene.restart({ level: nextLevel });
    } else {
      // Player has completed all levels
      this.scene.start("GameOver", {
        level: currentLevel,
        victory: true,
      });
    }
  }

  private createDebugDisplay() {
    this.debugText = this.add
      .text(20, 20, "", {
        fontFamily: "Arial",
        fontSize: "16px",
        backgroundColor: "#00000080",
        padding: { x: 10, y: 5 },
        color: "#ffffff",
      })
      .setScrollFactor(0)
      .setDepth(100);
  }

  private updateDebugDisplay() {
    const analog = this.analogInput;

    this.debugText.setText(
      [
        `W: ${analog.getKeyValue("W").toFixed(0)}%`,
        `A: ${analog.getKeyValue("A").toFixed(0)}%`,
        `D: ${analog.getKeyValue("D").toFixed(0)}%`,
        `SPACE: ${this.player.isChargingJumpState() ? "CHARGING" : "RELEASED"}`,
        `Charging: ${this.player.isChargingJumpState()}`,
      ].join("\n")
    );
  }

  private createInstructions() {
    this.instructionsText = this.add
      .text(
        512,
        50,
        "A/D: Move  |  SPACE: Charge Jump\n" +
          "While charging: W controls height, A/D control direction\n" +
          "Press N to skip to next level (testing)",
        {
          fontFamily: "Arial",
          fontSize: "18px",
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

  private createLevelText() {
    const level = this.registry.get("currentLevel") || 0;

    this.levelText = this.add
      .text(
        512,
        120,
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
