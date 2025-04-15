import { Scene } from "phaser";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  title_text: Phaser.GameObjects.Text;
  restart_text: Phaser.GameObjects.Text;
  level_selection: Phaser.GameObjects.Text[] = [];
  totalLevels: number = 4; // Default, will update from level manager

  constructor() {
    super("GameOver");
  }

  init(data: { level?: number; victory?: boolean }) {
    // Store level data
    this.registry.set("gameOverLevel", data.level || 0);
    this.registry.set("victory", data.victory || false);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.3);

    // Determine if this is a victory screen
    const isVictory = this.registry.get("victory") || false;

    if (isVictory) {
      this.background.setTint(0x55ff55); // Green tint for victory
      this.title_text = this.add
        .text(512, 250, "Victory!", {
          fontFamily: "Arial Black",
          fontSize: 64,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        })
        .setOrigin(0.5);

      // Add congratulations
      this.add
        .text(512, 320, "You completed all levels!", {
          fontFamily: "Arial",
          fontSize: 24,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          align: "center",
        })
        .setOrigin(0.5);
    } else {
      this.background.setTint(0xff5555); // Red tint for game over
      this.title_text = this.add
        .text(512, 250, "Game Over", {
          fontFamily: "Arial Black",
          fontSize: 64,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        })
        .setOrigin(0.5);
    }

    // Add restart button
    this.restart_text = this.add
      .text(512, 380, "Restart Same Level", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Pulse animation for restart text
    this.tweens.add({
      targets: this.restart_text,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Restart current level
    this.restart_text.on("pointerdown", () => {
      const currentLevel = this.registry.get("gameOverLevel") || 0;
      this.scene.start("Game", { level: currentLevel });
    });

    // Return to main menu
    const menuText = this.add
      .text(512, 430, "Main Menu", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menuText.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    // Create level selection
    this.createLevelSelection();
  }

  private createLevelSelection() {
    // Get total levels
    this.totalLevels = 4; // Default

    // Level selection header
    this.add
      .text(512, 500, "Level Selection:", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      })
      .setOrigin(0.5);

    // Create a button for each level
    const buttonWidth = 100;
    const spacing = 20;
    const totalWidth =
      this.totalLevels * buttonWidth + (this.totalLevels - 1) * spacing;
    const startX = 512 - totalWidth / 2 + buttonWidth / 2;

    for (let i = 0; i < this.totalLevels; i++) {
      const levelText = this.add
        .text(startX + i * (buttonWidth + spacing), 550, `Level ${i + 1}`, {
          fontFamily: "Arial",
          fontSize: 18,
          color: "#ffffff",
          backgroundColor: "#444444",
          padding: { x: 10, y: 5 },
          align: "center",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // Highlight current level
      const currentLevel = this.registry.get("gameOverLevel") || 0;
      if (i === currentLevel) {
        levelText.setBackgroundColor("#008800");
      }

      // Handle level selection
      levelText.on("pointerdown", () => {
        this.scene.start("Game", { level: i });
      });

      this.level_selection.push(levelText);
    }
  }
}
