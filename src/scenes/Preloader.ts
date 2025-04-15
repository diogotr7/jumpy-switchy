import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // Add background
    this.add.image(512, 384, "background");

    // Progress bar outline
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    // Progress bar fill
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    // Update progress bar as assets load
    this.load.on("progress", (value: number) => {
      bar.width = 4 + 460 * value;
      bar.x = 512 - 230 + (460 * value) / 2;
    });

    // Loading text
    this.add
      .text(512, 340, "Loading...", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  preload() {
    this.load.setPath("assets");

    // Load game assets
    this.load.image("logo", "logo.png");
    this.load.image("player", "player.png");
    this.load.image("platform", "platform.png");

    // Create placeholder assets if they don't exist
    this.load.on("filecomplete", (_key: string) => {
      // We'll use this to handle missing files
    });

    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      // Create placeholder images for missing files
      if (file.key === "player") {
        this.createPlayerImage();
      } else if (file.key === "platform") {
        this.createPlatformImage();
      }
    });
  }

  create() {
    // Create any missing assets
    if (!this.textures.exists("player")) {
      this.createPlayerImage();
    }

    if (!this.textures.exists("platform")) {
      this.createPlatformImage();
    }

    // Move to Connect Keyboard screen
    this.scene.start("MainMenu");
  }

  private createPlayerImage() {
    // Create a simple player sprite
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x4488ff);
    graphics.fillRect(0, 0, 32, 64);
    graphics.fillStyle(0x3366cc);
    graphics.fillRect(0, 32, 32, 32);

    // Generate texture
    graphics.generateTexture("player", 32, 64);
    graphics.destroy();
  }

  private createPlatformImage() {
    // Create a simple platform sprite
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x00aa00);
    graphics.fillRect(0, 0, 128, 32);
    graphics.fillStyle(0x008800);
    graphics.fillRect(0, 16, 128, 16);

    // Generate texture
    graphics.generateTexture("platform", 128, 32);
    graphics.destroy();
  }
}
