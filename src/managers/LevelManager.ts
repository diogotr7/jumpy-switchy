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
          case LevelElement.END:
            this.endX = worldX;
            this.endY = worldY;
            // Create an end marker or trigger
            this.createEndTrigger(worldX, worldY);
            break;
          case LevelElement.COIN:
            // Create a coin at this position
            this.createCoin(worldX, worldY);
            break;
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
    // Make platforms fill their grid cells horizontally but thinner vertically
    platform.setScale(1, 0.5);
    // Set collision size to match the visual size, accounting for the scale
    platform.setSize(GRID_SIZE, GRID_SIZE * 0.5);
    platform.refreshBody();
  }

  private createWall(x: number, y: number): void {
    // For walls, we need to create a taller element that extends the full height
    const wall = this.platforms.create(x, y, "blockBrown");
    // Make the wall the full cell width to avoid gaps
    wall.setScale(0.5, 0.5);
    wall.setSize(GRID_SIZE, GRID_SIZE);
    wall.refreshBody();
  }

  private createEndTrigger(x: number, y: number): void {
    // Create a visual element for the end trigger
    const endTrigger = this.scene.add.sprite(x, y, "tileYellow");
    endTrigger.setScale(0.75);
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

  private createCoin(x: number, y: number): void {
    // This is a placeholder - implement coin creation if needed
    const coin = this.scene.add.sprite(x, y, "tileYellow");
    coin.setScale(0.3);

    // Add a rotation animation
    this.scene.tweens.add({
      targets: coin,
      angle: 360,
      duration: 2000,
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
