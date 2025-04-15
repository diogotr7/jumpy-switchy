import { Player } from "./Player";

export class JumpPreview {
  private player: Player;
  private graphics: Phaser.GameObjects.Graphics;
  private previewPoints: Phaser.Math.Vector2[] = [];

  constructor(scene: Phaser.Scene, player: Player) {
    this.player = player;
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

    // Draw trajectory line
    const color = Phaser.Display.Color.GetColor(255, 255, 255);
    const alpha = 0.6;

    this.graphics.lineStyle(2, color, alpha);

    // Draw trajectory path
    if (this.previewPoints.length > 1) {
      this.graphics.beginPath();
      this.graphics.moveTo(this.previewPoints[0].x, this.previewPoints[0].y);

      for (let i = 1; i < this.previewPoints.length; i++) {
        this.graphics.lineTo(this.previewPoints[i].x, this.previewPoints[i].y);
      }

      this.graphics.strokePath();
    }

    // Draw arrow at start of trajectory
    this.drawArrow(playerX, playerY, jumpDirection);
  }

  private calculateTrajectory(
    x: number,
    y: number,
    direction: Phaser.Math.Vector2
  ): void {
    this.previewPoints = [];

    // Physics simulation values
    const gravity = 800; // Should match player gravity
    const baseJumpPower = 600; // Should match player jumpPower

    // Initial velocity components
    const velocityX = direction.x * baseJumpPower;
    const velocityY = direction.y * baseJumpPower;

    // Simulate trajectory
    const numPoints = 20;
    const timeStep = 0.05; // seconds per point

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

  private drawArrow(
    x: number,
    y: number,
    direction: Phaser.Math.Vector2
  ): void {
    const arrowLength = 30;
    const color = Phaser.Display.Color.GetColor(255, 255, 255);

    // Draw main line
    this.graphics.lineStyle(3, color, 0.8);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);

    const endX = x + direction.x * arrowLength;
    const endY = y + direction.y * arrowLength;

    this.graphics.lineTo(endX, endY);
    this.graphics.strokePath();

    // Draw arrowhead
    const headLength = 10;
    const angle = Math.atan2(direction.y, direction.x);

    this.graphics.beginPath();
    this.graphics.moveTo(endX, endY);
    this.graphics.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.graphics.moveTo(endX, endY);
    this.graphics.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.graphics.strokePath();
  }
}
