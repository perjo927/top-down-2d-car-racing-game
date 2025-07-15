import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Game } from "../Game";
import { Application } from "pixi.js";
import { Car } from "../Car";
import { InputManager } from "../InputManager";
import { Track } from "../Track";
import { LapTimer } from "../LapTimer";

// Mock document and window objects globally before any other mocks that might depend on them
let originalDocument;
let originalWindow;
let mockDiv;

beforeEach(() => {
  originalDocument = global.document;
  originalWindow = global.window;

  mockDiv = {
    appendChild: vi.fn(),
  };

  global.document = {
    createElement: vi.fn(() => ({
      appendChild: vi.fn(),
    })),
    getElementById: vi.fn(() => mockDiv),
  };

  global.window = {}; // Mock window object
});

afterEach(() => {
  global.document = originalDocument;
  global.window = originalWindow;
  vi.restoreAllMocks();
});

// Mock external dependencies
vi.mock("pixi.js", () => ({
  Application: vi.fn(() => ({
    init: vi.fn(() => Promise.resolve()),
    canvas: global.document.createElement("canvas"),
    stage: {
      addChild: vi.fn(),
    },
    ticker: {
      add: vi.fn(),
    },
  })),
}));

vi.mock("../Car", () => ({
  Car: vi.fn(() => ({
    graphics: {},
    update: vi.fn(),
  })),
}));

vi.mock("../InputManager", () => ({
  InputManager: vi.fn(() => ({
    init: vi.fn(),
  })),
}));

vi.mock("../Track", () => ({
  Track: vi.fn(() => ({
    graphics: {},
  })),
}));

vi.mock("../LapTimer", () => ({
  LapTimer: vi.fn(() => ({
    update: vi.fn(),
  })),
}));

describe("Game", () => {
  let game;

  beforeEach(() => {
    // Reset mocks before each test
    Application.mockClear();
    Car.mockClear();
    InputManager.mockClear();
    Track.mockClear();
    LapTimer.mockClear();

    game = new Game();
  });

  it("should create instances of Application and InputManager in constructor", () => {
    expect(Application).toHaveBeenCalledTimes(1);
    expect(InputManager).toHaveBeenCalledTimes(1);
    expect(game.app).toBeDefined();
    expect(game.inputManager).toBeDefined();
  });

  it("should initialize Pixi.js application and append canvas to DOM", async () => {
    await game.init();
    expect(game.app.init).toHaveBeenCalledWith({
      background: "#1099bb",
      resizeTo: global.window,
    });
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "pixi-container",
    );
    expect(mockDiv.appendChild).toHaveBeenCalledWith(game.app.canvas);
  });

  it("should resolve load method", async () => {
    await expect(game.load()).resolves.toBeUndefined();
  });

  it("should call init, load, and initialize game components on start", async () => {
    // Spy on init and load to ensure they are called
    const initSpy = vi.spyOn(game, "init");
    const loadSpy = vi.spyOn(game, "load");

    await game.start();

    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(game.inputManager.init).toHaveBeenCalledTimes(1);
    expect(Track).toHaveBeenCalledTimes(1);
    expect(Car).toHaveBeenCalledTimes(1);
    expect(LapTimer).toHaveBeenCalledTimes(1);
    expect(game.app.stage.addChild).toHaveBeenCalledWith(game.track.graphics);
    expect(game.app.stage.addChild).toHaveBeenCalledWith(game.car.graphics);
    expect(game.app.ticker.add).toHaveBeenCalledWith(expect.any(Function));

    // Ensure Car, Track, LapTimer are instantiated with correct arguments
    expect(Track).toHaveBeenCalledWith(game.app);
    expect(Car).toHaveBeenCalledWith(game.app, game.inputManager, game.track);
    expect(LapTimer).toHaveBeenCalledWith(game.app, game.track);
  });

  it("should update car and lap timer in update method", () => {
    // Manually set up car and lapTimer for update test
    game.car = new Car();
    game.lapTimer = new LapTimer();

    const mockTime = { deltaTime: 1 };
    game.update(mockTime);

    expect(game.car.update).toHaveBeenCalledWith(mockTime);
    expect(game.lapTimer.update).toHaveBeenCalledWith(game.car);
  });
});
