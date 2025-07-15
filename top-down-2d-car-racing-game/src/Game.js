import { Application } from "pixi.js";
import { Car } from "./Car.js";
import { InputManager } from "./InputManager.js";
import { Track } from "./Track.js";
import { LapTimer } from "./LapTimer.js";

export class Game {
  constructor() {
    this.app = new Application();
    this.inputManager = new InputManager();
  }

  async init() {
    await this.app.init({
      background: "#1099bb",
      resizeTo: window,
    });
    document.getElementById("pixi-container").appendChild(this.app.canvas);
  }

  load() {
    // For now, we don't have assets to load for the car,
    // but we will later (e.g., car sprite, track texture).
    // This is a placeholder for asset loading.
    return Promise.resolve();
  }

  async start() {
    await this.init();
    await this.load();

    this.inputManager.init();

    // Create the track
    this.track = new Track(this.app);
    this.app.stage.addChild(this.track.graphics);

    // Create the car
    this.car = new Car(this.app, this.inputManager, this.track);
    this.app.stage.addChild(this.car.graphics);

    // Create the lap timer
    this.lapTimer = new LapTimer(this.app, this.track);

    // Start the game loop
    this.app.ticker.add((time) => this.update(time));
  }

  update(time) {
    // Update game objects
    this.car.update(time);
    this.lapTimer.update(this.car);
  }
}
