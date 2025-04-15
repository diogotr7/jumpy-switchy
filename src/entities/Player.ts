import { AnalogInput } from "../utils/AnalogInput";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private analogInput: AnalogInput;
  private isChargingJump: boolean = false;
  private jumpDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, -1); // Default up
  private spaceKey: Phaser.Input.Keyboard.Key;

  // Jump constraints
  private readonly minJumpHeight: number = 0.3; // Minimum vertical component
  private readonly maxJumpHeight: number = 1.0; // Maximum vertical component
  private readonly minHorizontal: number = 0.0; // Minimum horizontal component
  private readonly maxHorizontal: number = 0.8; // Maximum horizontal component
  private readonly baseJumpPower: number = 600; // Base power for jumps

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    analogInput: AnalogInput
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.analogInput = analogInput;

    // Set up keyboard for spacebar
    this.spaceKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Set physics properties
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(800);
    body.setCollideWorldBounds(false);
    body.setBounce(0.4, 0.1);
    body.setSize(32, 64);
    body.setFriction(0, 0);
  }

  update(_time: number, _delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;

    // Get analog input values
    const aValue = this.analogInput.getKeyValue("A");
    const dValue = this.analogInput.getKeyValue("D");

    if (onGround) {
      // Start charging jump when space is pressed (standard keyboard input)
      if (
        Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
        !this.isChargingJump
      ) {
        this.isChargingJump = true;
      }
    }

    // Handle normal movement (only when not charging jump)
    if (!this.isChargingJump && onGround) {
      // A and D move the character when not charging
      const moveSpeed = 300; // Base speed
      const analogRatio = (dValue - aValue) / 100;
      body.setVelocityX(analogRatio * moveSpeed);

      // Set appropriate animation
      if (analogRatio > 0.1) {
        this.setFlipX(false);
      } else if (analogRatio < -0.1) {
        this.setFlipX(true);
      }
    } else if (!this.isChargingJump) {
      // No air control - once in the air, player cannot affect movement
      // Until they land again
    }

    // Handle jump charging and execution
    if (this.isChargingJump && onGround) {
      // Stop movement while charging
      body.setVelocityX(0);

      // Update jump direction based on WAD
      this.updateJumpDirection();

      // Space released = execute jump (using standard keyboard input)
      if (Phaser.Input.Keyboard.JustUp(this.spaceKey)) {
        this.executeJump();
      }
    }
  }

  private updateJumpDirection(): void {
    // Get analog values
    const wValue = this.analogInput.getKeyValue("W") / 100;
    const aValue = this.analogInput.getKeyValue("A") / 100;
    const dValue = this.analogInput.getKeyValue("D") / 100;

    // Calculate vertical component (W scales upward force)
    const verticalComponent = -this.clamp(
      wValue,
      this.minJumpHeight,
      this.maxJumpHeight
    );

    // Calculate horizontal component (A and D control left/right)
    const horizontalComponent = this.clamp(
      dValue - aValue,
      -this.maxHorizontal,
      this.maxHorizontal
    );

    // Set direction vector
    this.jumpDirection.set(horizontalComponent, verticalComponent);

    // Normalize if needed
    if (this.jumpDirection.length() > 1) {
      this.jumpDirection.normalize();
    }
  }

  private executeJump(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Apply velocity in the jump direction
    body.setVelocity(
      this.jumpDirection.x * this.baseJumpPower,
      this.jumpDirection.y * this.baseJumpPower
    );

    // Reset charging state
    this.isChargingJump = false;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  public isChargingJumpState(): boolean {
    return this.isChargingJump;
  }

  public getJumpDirection(): Phaser.Math.Vector2 {
    return this.jumpDirection.clone();
  }
}
