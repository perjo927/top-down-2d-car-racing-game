import { Text } from "pixi.js";

export class LapTimer {
  constructor(app, track) {
    this.app = app;
    this.track = track;
    this.nextCheckpoint = 0;
    this.lapStartTime = 0;
    this.currentLapTime = 0;
    this.lastLapTime = 0;

    // Create the text for the lap timer
    this.lapTimeText = new Text({
      text: "Lap: 0.00\nLast: 0.00",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        align: "left",
      },
    });
    this.lapTimeText.position.set(10, 10);
    this.app.stage.addChild(this.lapTimeText);
  }

  update(car) {
    const checkpoint = this.track.checkpoints[this.nextCheckpoint];
    if (checkpoint.contains(car.x, car.y)) {
      if (this.nextCheckpoint === 0) {
        // Crossed the start/finish line
        if (this.lapStartTime !== 0) {
          // Finished a lap
          this.lastLapTime = this.currentLapTime;
        }
        this.lapStartTime = Date.now();
        this.nextCheckpoint = 1;
      } else {
        this.nextCheckpoint++;
        if (this.nextCheckpoint >= this.track.checkpoints.length) {
          this.nextCheckpoint = 0; // Loop back to the start/finish line
        }
      }
    }

    if (this.lapStartTime !== 0) {
      this.currentLapTime = (Date.now() - this.lapStartTime) / 1000;
    }

    this.lapTimeText.text = `Lap: ${this.currentLapTime.toFixed(2)}\nLast: ${this.lastLapTime.toFixed(2)}`;
  }
}
