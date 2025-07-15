import { Graphics } from "pixi.js";

export class Car {
  constructor(app, inputManager, track) {
    this.app = app;
    this.inputManager = inputManager;
    this.track = track;

    this.x = this.app.screen.width / 2;
    this.y = this.app.screen.height / 2 - this.track.outerRadiusY - 50;
    this.angle = 0;
    this.speed = 0;

    // Car physics properties
    this.acceleration = 0.1;
    this.maxSpeed = 5;
    this.friction = 0.05;
    this.turnSpeed = 0.05;

    // Create the car graphics
    this.graphics = new Graphics();
    this.graphics.rect(-15, -10, 30, 20); // Simple rectangle for the car body
    this.graphics.fill(0x000000);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(15, 0);
    this.graphics.stroke({ width: 2, color: 0xffffff }); // Line to show direction

    this.updateGraphics();
  }

  update(time) {
    const onTrack = !this.track.isOffTrack(this.x, this.y);

    const currentFriction = onTrack ? this.friction : this.friction * 1.5; // More friction on grass, but not impossible
    const currentMaxSpeed = onTrack ? this.maxSpeed : this.maxSpeed / 2; // Slower on grass
    const currentTurnSpeed = onTrack ? this.turnSpeed : this.turnSpeed / 2; // Less grip on grass

    const handbrake = this.inputManager.keys[" "];
    let isAccelerating = false;

    // Handle input
    if (this.inputManager.keys["w"] || this.inputManager.keys["W"]) {
      this.speed += this.acceleration;
      isAccelerating = true;
    }
    if (this.inputManager.keys["s"] || this.inputManager.keys["S"]) {
      this.speed -= this.acceleration;
      isAccelerating = true;
    }

    // Apply friction and handbrake
    if (handbrake) {
      if (this.speed > 0) {
        this.speed -= currentFriction * 2;
      } else if (this.speed < 0) {
        this.speed += currentFriction * 2;
      }
    } else {
      if (this.speed > 0) {
        this.speed -= currentFriction;
      } else if (this.speed < 0) {
        this.speed += currentFriction;
      }
    }

    // Stop the car if speed is very low and not accelerating
    if (!isAccelerating && Math.abs(this.speed) < currentFriction) {
      this.speed = 0;
    }

    // Clamp speed to max speed
    this.speed = Math.max(
      -currentMaxSpeed / 2,
      Math.min(currentMaxSpeed, this.speed),
    );

    // Handle turning
    if (this.speed !== 0) {
      const turnDirection = this.speed > 0 ? 1 : -1;
      if (this.inputManager.keys["a"] || this.inputManager.keys["A"]) {
        this.angle -= currentTurnSpeed * turnDirection;
      }
      if (this.inputManager.keys["d"] || this.inputManager.keys["D"]) {
        this.angle += currentTurnSpeed * turnDirection;
      }
    }

    // Update position
    this.x += Math.cos(this.angle) * this.speed * time.deltaTime;
    this.y += Math.sin(this.angle) * this.speed * time.deltaTime;

    this.updateGraphics();
  }

  updateGraphics() {
    this.graphics.position.set(this.x, this.y);
    this.graphics.rotation = this.angle;
  }
}
