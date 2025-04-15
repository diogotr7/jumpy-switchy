import { Scene, GameObjects } from "phaser";
import { AnalogInput } from "../utils/AnalogInput";
import { LEVELS } from "../data/LevelData";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  subtitle: GameObjects.Text;
  startText: GameObjects.Text;
  levelSelectText: GameObjects.Text;
  private analogInput: AnalogInput;
  private levelSelectActive: boolean = false;
  private levelButtons: GameObjects.Text[] = [];

  constructor() {
    super("MainMenu");
  }

  init() {
    // Create analog input system
    this.analogInput = new AnalogInput();

    // Share it with other scenes
    this.registry.set("analogInput", this.analogInput);

    // Reset level selection
    this.levelSelectActive = false;
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.logo = this.add.image(512, 200, "logo");

    this.title = this.add
      .text(512, 340, "Jumpy Switchy", {
        fontFamily: "Arial Black",
        fontSize: 48,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.subtitle = this.add
      .text(512, 400, "Analog Controller Demo", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        align: "center",
      })
      .setOrigin(0.5);

    this.analogInput.initExisting().then((alreadyConnected) => {
      if (alreadyConnected) {
        this.createMenuOptions();
      } else {
        this.createAnalogSetup();
      }
    });
  }

  private createMenuOptions() {
    // Start game button (Level 1)
    this.startText = this.add
      .text(512, 480, "Start Game", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        padding: { x: 20, y: 10 },
        backgroundColor: "#00000080",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Pulse animation for the start text
    this.tweens.add({
      targets: this.startText,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.startText.on("pointerdown", () => {
      this.scene.start("Game", { level: 0 });
    });

    // Level select button
    this.levelSelectText = this.add
      .text(512, 550, "Level Select", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        padding: { x: 20, y: 10 },
        backgroundColor: "#00000080",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.levelSelectText.on("pointerdown", () => {
      this.toggleLevelSelect();
    });
  }

  private createAnalogSetup() {
    //we need to tell the user they need to connect the keyboard, by calling analogInput.initNew()
    this.startText = this.add
      .text(512, 520, "Connect your Analog Keyboard", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        padding: { x: 20, y: 10 },
        backgroundColor: "#00000080",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.startText.on("pointerdown", () => {
      this.startText.setAlpha(0.5);
      this.startText.setText("Connecting...");
      this.startText.setInteractive(false);

      this.analogInput.initNew().then((success) => {
        if (!success) return;

        // Remove connecting message and create menu options
        this.startText.destroy();
        this.createMenuOptions();
      });
    });
  }

  private toggleLevelSelect() {
    this.levelSelectActive = !this.levelSelectActive;

    if (this.levelSelectActive) {
      // Hide main menu buttons
      this.startText.setVisible(false);
      this.levelSelectText.setText("Back to Menu");

      // Create level select UI
      this.createLevelButtons();
    } else {
      // Show main menu buttons
      this.startText.setVisible(true);
      this.levelSelectText.setText("Level Select");

      // Remove level buttons
      this.levelButtons.forEach((button) => button.destroy());
      this.levelButtons = [];
    }
  }

  private createLevelButtons() {
    const levelCount = LEVELS.length;
    const buttonWidth = 200;
    const buttonHeight = 50;
    const spacing = 20;
    const columns = 2;

    for (let i = 0; i < levelCount; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);

      const x =
        512 -
        (buttonWidth + spacing) * (columns / 2 - 0.5) +
        col * (buttonWidth + spacing);
      const y = 460 + row * (buttonHeight + spacing);

      const button = this.add
        .text(x, y, `Level ${i + 1}`, {
          fontFamily: "Arial",
          fontSize: 20,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          padding: { x: 20, y: 10 },
          backgroundColor: "#000000aa",
          align: "center",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // Handle level selection
      button.on("pointerdown", () => {
        this.scene.start("Game", { level: i });
      });

      // Hover effect
      button.on("pointerover", () => {
        button.setBackgroundColor("#444444");
      });

      button.on("pointerout", () => {
        button.setBackgroundColor("#000000aa");
      });

      this.levelButtons.push(button);
    }
  }
}
