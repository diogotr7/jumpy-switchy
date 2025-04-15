import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game as PhaserGame, Types } from "phaser";

// Game configuration
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#028af8",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
  },
  scene: [Boot, Preloader, MainMenu, Game],
};

export default new PhaserGame(config);
