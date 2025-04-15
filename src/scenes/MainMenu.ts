import { Scene, GameObjects } from "phaser";
import { AnalogInput } from "../utils/AnalogInput";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  subtitle: GameObjects.Text;
  startText: GameObjects.Text;
  private analogInput: AnalogInput;

  constructor() {
    super("MainMenu");
  }

  init() {
    // Create analog input system
    this.analogInput = new AnalogInput();

    // Share it with other scenes
    this.registry.set("analogInput", this.analogInput);
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.logo = this.add.image(512, 260, "logo");

    this.title = this.add
      .text(512, 400, "Jumpy Switchy", {
        fontFamily: "Arial Black",
        fontSize: 48,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.subtitle = this.add
      .text(512, 460, "Analog Controller Demo", {
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
        this.createStart();
      } else {
        this.createAnalogSetup();
      }
    });
  }

  private createStart() {
    //we can start the game, we have analog input
    this.startText = this.add
      .text(512, 550, "Click to Start", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Pulse animation for the start text
    this.tweens.add({
      targets: this.startText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }

  private createAnalogSetup() {
    //we need to tell the user they need to connect the keyboard, by calling analogInput.initNew()
    this.startText = this.add
      .text(512, 550, "Connect your Analog Keyboard", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    this.startText.setInteractive({ useHandCursor: true });
    this.startText.on("pointerdown", () => {
      this.startText.setAlpha(0.5);
      this.startText.setText("Connecting...");
      this.startText.setInteractive(false);

      this.analogInput.initNew().then((success) => {
        if (!success) return;

        this.startText.setText("Click to Start");
        this.startText.setAlpha(1);
        this.startText.setInteractive({ useHandCursor: true });
        this.startText.off("pointerdown");
        this.startText.on("pointerdown", () => {
          this.scene.start("Game");
        });
      });
    });
  }
}
