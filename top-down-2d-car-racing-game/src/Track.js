import { Graphics, Rectangle } from "pixi.js";

export class Track {
  constructor(app) {
    this.app = app;
    this.graphics = new Graphics();

    // Define track properties
    this.trackWidth = 100;
    const trackColor = 0x333333; // Dark grey for the track
    const grassColor = 0x009900; // Green for the grass

    // Get screen dimensions
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    // Center of the ellipses
    this.centerX = screenWidth / 2;
    this.centerY = screenHeight / 2;

    // Radii of the outer ellipse
    this.outerRadiusX = screenWidth / 2 - 50;
    this.outerRadiusY = screenHeight / 2 - 50;

    // Radii of the inner ellipse
    this.innerRadiusX = this.outerRadiusX - this.trackWidth;
    this.innerRadiusY = this.outerRadiusY - this.trackWidth;

    // Draw the outer grass area
    this.graphics.rect(0, 0, screenWidth, screenHeight);
    this.graphics.fill(grassColor);

    // Draw the outer ellipse of the track
    this.graphics.ellipse(
      this.centerX,
      this.centerY,
      this.outerRadiusX,
      this.outerRadiusY,
    );
    this.graphics.fill(trackColor);

    // Draw the inner ellipse (grass area)
    this.graphics.ellipse(
      this.centerX,
      this.centerY,
      this.innerRadiusX,
      this.innerRadiusY,
    );
    this.graphics.fill(grassColor);

    this.defineCheckpoints();
    this.drawCheckpoints(); // For debugging
  }

  defineCheckpoints() {
    // Define the start/finish line and checkpoints as rectangles that span the track
    this.checkpoints = [
      // Start/Finish line (top of the oval)
      new Rectangle(
        this.centerX - this.outerRadiusX,
        this.centerY - this.outerRadiusY - 10,
        this.outerRadiusX * 2,
        20,
      ),
      // Checkpoint 1 (right side of the oval)
      new Rectangle(
        this.centerX + this.innerRadiusX - 10,
        this.centerY - this.outerRadiusY,
        20,
        this.outerRadiusY * 2,
      ),
      // Checkpoint 2 (bottom of the oval)
      new Rectangle(
        this.centerX - this.outerRadiusX,
        this.centerY + this.outerRadiusY - 10,
        this.outerRadiusX * 2,
        20,
      ),
      // Checkpoint 3 (left side of the oval)
      new Rectangle(
        this.centerX - this.outerRadiusX - 10,
        this.centerY - this.outerRadiusY,
        20,
        this.outerRadiusY * 2,
      ),
    ];
  }

  drawCheckpoints() {
    this.checkpoints.forEach((cp, index) => {
      this.graphics.rect(cp.x, cp.y, cp.width, cp.height);
      const color = index === 0 ? 0xffffff : 0xffff00;
      this.graphics.fill({ color, alpha: 0.5 });
    });
  }

  isOffTrack(x, y) {
    const dx = x - this.centerX;
    const dy = y - this.centerY;

    // Check if the point is outside the outer ellipse
    const isOutsideOuter =
      (dx * dx) / (this.outerRadiusX * this.outerRadiusX) +
        (dy * dy) / (this.outerRadiusY * this.outerRadiusY) >
      1;

    // Check if the point is inside the inner ellipse
    const isInsideInner =
      (dx * dx) / (this.innerRadiusX * this.innerRadiusX) +
        (dy * dy) / (this.innerRadiusY * this.innerRadiusY) <
      1;

    return isOutsideOuter || isInsideInner;
  }
}
