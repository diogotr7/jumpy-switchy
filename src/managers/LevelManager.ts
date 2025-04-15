import { LevelData, LEVELS, LevelElement, GRID_SIZE } from "../data/LevelData";

export class LevelManager {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private currentLevel: number = 0;
  private playerStartX: number = 0;
  private playerStartY: number = 0;
  private endX: number = 0;
  private endY: number = 0;

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

    // Reset start and end positions
    this.playerStartX = 0;
    this.playerStartY = 0;
    this.endX = 0;
    this.endY = 0;

    // Get current level data
    const levelData = this.getCurrentLevelData();
    const grid = levelData.grid;

    // Create all elements from the grid
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const element = row[x];
        // Place elements in the center of each grid cell
        const worldX = x * GRID_SIZE + GRID_SIZE / 2;
        const worldY = y * GRID_SIZE + GRID_SIZE / 2;

        switch (element) {
          case LevelElement.GROUND:
            // For ground tiles, create a platform that's wider and centered correctly
            this.createPlatform(
              worldX,
              worldY,
              `${levelData.platformType}Middle`
            );
            break;
          case LevelElement.PLATFORM:
            // Create a regular platform
            this.createPlatform(worldX, worldY, levelData.platformType);
            break;
          case LevelElement.PLATFORM_MIDDLE:
            this.createPlatform(
              worldX,
              worldY,
              `${levelData.platformType}Middle`
            );
            break;
          case LevelElement.PLATFORM_LEFT:
            this.createPlatform(
              worldX,
              worldY,
              `${levelData.platformType}Left`
            );
            break;
          case LevelElement.PLATFORM_RIGHT:
            this.createPlatform(
              worldX,
              worldY,
              `${levelData.platformType}Right`
            );
            break;
          case LevelElement.WALL:
            this.createWall(worldX, worldY);
            break;
          case LevelElement.PLAYER:
            this.playerStartX = worldX;
            this.playerStartY = worldY;
            break;
          case LevelElement.END:
            this.endX = worldX;
            this.endY = worldY;
            // Create an end marker or trigger
            this.createEndTrigger(worldX, worldY);
            break;
        }
      }
    }

    return this.platforms;
  }

  private createPlatform(x: number, y: number, texture: string): void {
    const platform = this.platforms.create(x, y, texture);

    // Get texture dimensions
    const textureWidth = platform.width;
    const textureHeight = platform.height;

    // Calculate scaling to match grid size
    const scaleX = GRID_SIZE / textureWidth;
    const scaleY = GRID_SIZE / textureHeight;

    // Apply the calculated scale
    platform.setScale(scaleX, scaleY);

    // Set collision size to match the grid dimensions
    platform.setSize(GRID_SIZE, GRID_SIZE * 0.5);
    platform.refreshBody();
  }

  private createWall(x: number, y: number): void {
    // For walls, we need to create a element that extends the full grid cell
    const wall = this.platforms.create(x, y, "blockBrown");

    // Get texture dimensions
    const textureWidth = wall.width;
    const textureHeight = wall.height;

    // Calculate scaling to match grid size
    const scaleX = GRID_SIZE / textureWidth;
    const scaleY = GRID_SIZE / textureHeight;

    // Apply the calculated scale
    wall.setScale(scaleX, scaleY);

    // Set collision size to match the grid dimensions
    wall.setSize(GRID_SIZE, GRID_SIZE);
    wall.refreshBody();
  }

  private createEndTrigger(x: number, y: number): void {
    // Create a visual element for the end trigger
    const endTrigger = this.scene.add.sprite(x, y, "exit");

    // Get texture dimensions
    const textureWidth = endTrigger.width;
    const textureHeight = endTrigger.height;

    // Calculate scaling - we want the end trigger to be 75% of a grid cell
    const targetSize = GRID_SIZE * 0.75;
    const scaleX = targetSize / textureWidth;
    const scaleY = targetSize / textureHeight;

    // Apply the calculated scale
    endTrigger.setScale(scaleX, scaleY);
    endTrigger.setAlpha(0.8);

    // Add a subtle animation to make it more visible
    this.scene.tweens.add({
      targets: endTrigger,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
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

  getEndPosition(): { x: number; y: number } {
    return {
      x: this.endX,
      y: this.endY,
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
