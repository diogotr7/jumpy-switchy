export class LevelManager {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.platforms = scene.physics.add.staticGroup();
  }

  createLevel(): Phaser.Physics.Arcade.StaticGroup {
    // Ground platform
    this.platforms.create(512, 768, "platform").setScale(20, 1).refreshBody();

    // Jump King style ascending platforms
    // Left-right pattern with increasingly difficult jumps
    this.createPlatform(300, 700, 4);
    this.createPlatform(700, 650, 3);
    this.createPlatform(200, 580, 3);
    this.createPlatform(550, 510, 2);
    this.createPlatform(300, 440, 2);
    this.createPlatform(700, 380, 2);
    this.createPlatform(450, 320, 1.5);
    this.createPlatform(200, 260, 1.5);
    this.createPlatform(400, 190, 1);
    this.createPlatform(650, 130, 1);
    this.createPlatform(350, 70, 1);

    // Return the platforms group for collisions
    return this.platforms;
  }

  private createPlatform(x: number, y: number, width: number): void {
    // Create platform with given position and width
    this.platforms.create(x, y, "platform").setScale(width, 0.5).refreshBody();
  }

  // Add more level creation methods as needed
  createWalls(): Phaser.Physics.Arcade.StaticGroup {
    // Create left and right walls to prevent falling off
    this.platforms.create(0, 384, "platform").setScale(0.5, 30).refreshBody();

    this.platforms
      .create(1024, 384, "platform")
      .setScale(0.5, 30)
      .refreshBody();

    return this.platforms;
  }
}
