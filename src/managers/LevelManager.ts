import { LevelData, LEVELS, LevelElement, GRID_SIZE } from "../data/LevelData";

export class LevelManager {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private currentLevel: number = 0;
  private playerStartX: number = 0;
  private playerStartY: number = 0;

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
    const grid = levelData.grid;

    // Create all elements from the grid
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const element = row[x];
        const worldX = x * GRID_SIZE + GRID_SIZE / 2;
        const worldY = y * GRID_SIZE + GRID_SIZE / 2;

        switch (element) {
          case LevelElement.GROUND:
            this.createPlatform(worldX, worldY, 1, levelData.platformType);
            break;
          case LevelElement.PLATFORM:
            this.createPlatform(worldX, worldY, 1, levelData.platformType);
            break;
          case LevelElement.WALL:
            this.createWall(worldX, worldY);
            break;
          case LevelElement.PLAYER:
            this.playerStartX = worldX;
            this.playerStartY = worldY;
            break;
          // Add cases for COIN and END when we implement them
        }
      }
    }

    return this.platforms;
  }

  private createPlatform(
    x: number,
    y: number,
    width: number,
    texture: string
  ): void {
    const platform = this.platforms.create(x, y, texture);
    platform.setScale(width, 0.5);
    platform.setSize(GRID_SIZE * width, GRID_SIZE * 0.5);
    platform.refreshBody();
  }

  private createWall(x: number, y: number): void {
    const wall = this.platforms.create(x, y, "blockBrown");
    wall.setScale(0.5, 1);
    wall.setSize(GRID_SIZE * 0.5, GRID_SIZE);
    wall.refreshBody();
  }

  getPlayerStartPosition(): { x: number; y: number } {
    // If no start position is set, place player above the ground
    if (this.playerStartX === 0 || this.playerStartY === 0) {
      const levelData = this.getCurrentLevelData();
      const grid = levelData.grid;
      // Find the ground row
      for (let y = grid.length - 1; y >= 0; y--) {
        if (grid[y].includes(LevelElement.GROUND)) {
          // Place player above the ground
          return {
            x: 512, // Center of the screen
            y: (y - 1) * GRID_SIZE + GRID_SIZE / 2,
          };
        }
      }
    }
    return {
      x: this.playerStartX || 512,
      y: this.playerStartY || 700,
    };
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
