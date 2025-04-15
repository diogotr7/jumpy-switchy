import { LevelData, LEVELS } from "../data/LevelData";

export class LevelManager {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private currentLevel: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.platforms = scene.physics.add.staticGroup();
  }

  getCurrentLevelData(): LevelData {
    return LEVELS[this.currentLevel];
  }

  setLevel(levelIndex: number): void {
    if (levelIndex >= 0 && levelIndex < LEVELS.length) {
      this.currentLevel = levelIndex;
    } else {
      console.warn(
        `Level ${levelIndex} does not exist. Using level 0 instead.`
      );
      this.currentLevel = 0;
    }
  }

  createLevel(): Phaser.Physics.Arcade.StaticGroup {
    // Clear any existing platforms
    this.platforms.clear(true, true);

    // Get current level data
    const levelData = this.getCurrentLevelData();

    // Set background color if specified
    if (levelData.backgroundColor) {
      this.scene.cameras.main.setBackgroundColor(levelData.backgroundColor);
    }

    // Create all platforms from level data
    levelData.platforms.forEach((platform) => {
      this.createPlatform(platform.x, platform.y, platform.width);
    });

    // Return the platforms group for collisions
    return this.platforms;
  }

  private createPlatform(x: number, y: number, width: number): void {
    // Create platform with given position and width
    this.platforms.create(x, y, "platform").setScale(width, 0.5).refreshBody();
  }

  createWalls(): Phaser.Physics.Arcade.StaticGroup {
    // Create left and right walls to prevent falling off
    this.platforms.create(0, 384, "platform").setScale(0.5, 30).refreshBody();
    this.platforms
      .create(1024, 384, "platform")
      .setScale(0.5, 30)
      .refreshBody();

    return this.platforms;
  }

  getTotalLevels(): number {
    return LEVELS.length;
  }

  nextLevel(): boolean {
    if (this.currentLevel < LEVELS.length - 1) {
      this.currentLevel++;
      return true;
    }
    return false;
  }
}
