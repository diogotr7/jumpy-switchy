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

    this.load.image(
      "blockBrown",
      "kenney_abstract-platformer/PNG/Other/blockBrown.png"
    );

    // Load level backgrounds - each level has background, hills, and tiles
    // Level 1
    this.load.image(
      "bg1_background",
      "kenney_abstract-platformer/PNG/Backgrounds/set1_background.png"
    );
    this.load.image(
      "bg1_hills",
      "kenney_abstract-platformer/PNG/Backgrounds/set1_hills.png"
    );
    this.load.image(
      "bg1_tiles",
      "kenney_abstract-platformer/PNG/Backgrounds/set1_tiles.png"
    );

    // Level 2
    this.load.image(
      "bg2_background",
      "kenney_abstract-platformer/PNG/Backgrounds/set2_background.png"
    );
    this.load.image(
      "bg2_hills",
      "kenney_abstract-platformer/PNG/Backgrounds/set2_hills.png"
    );
    this.load.image(
      "bg2_tiles",
      "kenney_abstract-platformer/PNG/Backgrounds/set2_tiles.png"
    );

    // Level 3
    this.load.image(
      "bg3_background",
      "kenney_abstract-platformer/PNG/Backgrounds/set3_background.png"
    );
    this.load.image(
      "bg3_hills",
      "kenney_abstract-platformer/PNG/Backgrounds/set3_hills.png"
    );
    this.load.image(
      "bg3_tiles",
      "kenney_abstract-platformer/PNG/Backgrounds/set3_tiles.png"
    );

    // Level 4
    this.load.image(
      "bg4_background",
      "kenney_abstract-platformer/PNG/Backgrounds/set4_background.png"
    );
    this.load.image(
      "bg4_hills",
      "kenney_abstract-platformer/PNG/Backgrounds/set4_hills.png"
    );
    this.load.image(
      "bg4_tiles",
      "kenney_abstract-platformer/PNG/Backgrounds/set4_tiles.png"
    );

    // Load platform tiles
    this.load.image(
      "tileBlue",
      "kenney_abstract-platformer/PNG/Tiles/Blue tiles/tileBlue_02.png"
    );

    this.load.image(
      "tileBlueLeft",
      "kenney_abstract-platformer/PNG/Tiles/Blue tiles/tileBlue_15.png"
    );
    this.load.image(
      "tileBlueMiddle",
      "kenney_abstract-platformer/PNG/Tiles/Blue tiles/tileBlue_05.png"
    );
    this.load.image(
      "tileBlueRight",
      "kenney_abstract-platformer/PNG/Tiles/Blue tiles/tileBlue_16.png"
    );

    this.load.image(
      "tileGreen",
      "kenney_abstract-platformer/PNG/Tiles/Green tiles/tileGreen_02.png"
    );

    this.load.image(
      "tileGreenLeft",
      "kenney_abstract-platformer/PNG/Tiles/Green tiles/tileGreen_15.png"
    );
    this.load.image(
      "tileGreenMiddle",
      "kenney_abstract-platformer/PNG/Tiles/Green tiles/tileGreen_05.png"
    );
    this.load.image(
      "tileGreenRight",
      "kenney_abstract-platformer/PNG/Tiles/Green tiles/tileGreen_16.png"
    );

    this.load.image(
      "tileYellow",
      "kenney_abstract-platformer/PNG/Tiles/Yellow tiles/tileYellow_03.png"
    );
    this.load.image(
      "tileYellowLeft",
      "kenney_abstract-platformer/PNG/Tiles/Yellow tiles/tileYellow_16.png"
    );
    this.load.image(
      "tileYellowMiddle",
      "kenney_abstract-platformer/PNG/Tiles/Yellow tiles/tileYellow_06.png"
    );
    this.load.image(
      "tileYellowRight",
      "kenney_abstract-platformer/PNG/Tiles/Yellow tiles/tileYellow_17.png"
    );

    this.load.image(
      "tileBrown",
      "kenney_abstract-platformer/PNG/Tiles/Brown tiles/tileBrown_04.png"
    );
    this.load.image(
      "tileBrownLeft",
      "kenney_abstract-platformer/PNG/Tiles/Brown tiles/tileBrown_16.png"
    );
    this.load.image(
      "tileBrownMiddle",
      "kenney_abstract-platformer/PNG/Tiles/Brown tiles/tileBrown_02.png"
    );
    this.load.image(
      "tileBrownRight",
      "kenney_abstract-platformer/PNG/Tiles/Brown tiles/tileBrown_17.png"
    );

    // Create placeholder assets if they don't exist
    this.load.on("filecomplete", (_key: string) => {
      // We'll use this to handle missing files
    });

    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      // Create placeholder images for missing files
      if (file.key === "player") {
        this.createPlayerImage();
      }
    });
  }

  create() {
    // Create any missing assets
    if (!this.textures.exists("player")) {
      this.createPlayerImage();
    }

    // Move to Connect Keyboard screen
    this.scene.start("MainMenu");
  }

  private createPlayerImage() {
    // Create a simple player sprite
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x4488ff);
    graphics.fillRect(0, 0, 32, 32);

    // Generate texture
    graphics.generateTexture("player", 32, 32);
    graphics.destroy();
  }
}
