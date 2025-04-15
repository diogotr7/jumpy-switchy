import { Player } from "./Player";

export class JumpPreview {
  private player: Player;
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private previewPoints: Phaser.Math.Vector2[] = [];

  constructor(scene: Phaser.Scene, player: Player) {
    this.player = player;
    this.scene = scene;
    this.graphics = scene.add.graphics();
  }

  update(): void {
    this.graphics.clear();

    // Only show preview when charging jump
    if (!this.player.isChargingJumpState()) {
      return;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const playerX = playerBody.x + playerBody.width / 2;
    const playerY = playerBody.y + playerBody.height;

    const jumpDirection = this.player.getJumpDirection();

    // Calculate trajectory preview
    this.calculateTrajectory(playerX, playerY, jumpDirection);

    // Draw trajectory line with border
    this.drawTrajectoryWithBorder();

    // Draw arrow at the tip of the trajectory
    if (this.previewPoints.length > 1) {
      // Get the direction at the tip by using the last two points
      const lastPoint = this.previewPoints[this.previewPoints.length - 1];
      const secondLastPoint = this.previewPoints[this.previewPoints.length - 2];

      // Calculate direction vector at the end of trajectory
      const tipDirection = new Phaser.Math.Vector2(
        lastPoint.x - secondLastPoint.x,
        lastPoint.y - secondLastPoint.y
      ).normalize();

      this.drawArrow(lastPoint.x, lastPoint.y, tipDirection);
    }
  }

  private calculateTrajectory(
    x: number,
    y: number,
    direction: Phaser.Math.Vector2
  ): void {
    this.previewPoints = [];

    // Physics simulation values
    const gravity = this.scene.physics.world.gravity.y;
    const fps = this.scene.game.config.physics.arcade?.fps || 60;
    const isDebug = this.scene.game.config.physics.arcade?.debug || false;
    const baseJumpPower = 600; // Should match player jumpPower

    // Initial velocity components
    const velocityX = direction.x * baseJumpPower;
    const velocityY = direction.y * baseJumpPower;

    // Simulate trajectory
    const numPoints = isDebug ? 10000 : 100; // Number of points to simulate
    const timeStep = 1 / fps; // seconds per point

    let posX = x;
    let posY = y;
    let velX = velocityX;
    let velY = velocityY;

    for (let i = 0; i < numPoints; i++) {
      // Add current position to points
      this.previewPoints.push(new Phaser.Math.Vector2(posX, posY));

      // Update position
      posX += velX * timeStep;
      posY += velY * timeStep;

      // Update velocity (only y affected by gravity)
      velY += gravity * timeStep;
    }
  }

  private drawTrajectoryWithBorder(): void {
    if (this.previewPoints.length <= 1) return;

    // First draw a black border
    this.graphics.lineStyle(4, 0x000000, 0.5);
    this.graphics.beginPath();
    this.graphics.moveTo(this.previewPoints[0].x, this.previewPoints[0].y);

    for (let i = 1; i < this.previewPoints.length; i++) {
      this.graphics.lineTo(this.previewPoints[i].x, this.previewPoints[i].y);
    }

    this.graphics.strokePath();

    // Then draw the white line on top
    this.graphics.lineStyle(2, 0xffffff, 0.6);
    this.graphics.beginPath();
    this.graphics.moveTo(this.previewPoints[0].x, this.previewPoints[0].y);

    for (let i = 1; i < this.previewPoints.length; i++) {
      this.graphics.lineTo(this.previewPoints[i].x, this.previewPoints[i].y);
    }

    this.graphics.strokePath();
  }

  private drawArrow(
    x: number,
    y: number,
    direction: Phaser.Math.Vector2
  ): void {
    // Arrow head parameters
    const headLength = 12;

    // Calculate arrowhead points
    const angle = Math.atan2(direction.y, direction.x);

    const leftX = x - headLength * Math.cos(angle - Math.PI / 6);
    const leftY = y - headLength * Math.sin(angle - Math.PI / 6);
    const rightX = x - headLength * Math.cos(angle + Math.PI / 6);
    const rightY = y - headLength * Math.sin(angle + Math.PI / 6);

    // Draw arrowhead border (black outline)
    this.graphics.lineStyle(5, 0x000000, 0.8);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(leftX, leftY);
    this.graphics.lineTo(rightX, rightY);
    this.graphics.closePath();
    this.graphics.strokePath();

    // Fill arrowhead with white
    this.graphics.fillStyle(0xffffff, 0.9);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(leftX, leftY);
    this.graphics.lineTo(rightX, rightY);
    this.graphics.closePath();
    this.graphics.fillPath();
  }
}
