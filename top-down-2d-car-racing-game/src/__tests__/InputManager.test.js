import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { InputManager } from "../InputManager";

describe("InputManager", () => {
  let inputManager;
  let addEventListenerMock;
  let removeEventListenerMock;
  let originalWindow;

  beforeEach(() => {
    // Save original window object
    originalWindow = global.window;

    // Mock window object for each test
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();

    // Temporarily replace global window for the test
    global.window = {
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      // Add other window properties if needed by InputManager constructor or init
    };

    inputManager = new InputManager();
  });

  afterEach(() => {
    // Restore original window object
    global.window = originalWindow;
    vi.restoreAllMocks();
  });

  it("should initialize with an empty keys object", () => {
    expect(inputManager.keys).toEqual({});
  });

  it("should add event listeners on init", () => {
    inputManager.init();
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "keyup",
      expect.any(Function),
    );
  });

  it("should set key to true on keydown", () => {
    inputManager.init();
    const keydownHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "keydown",
    )[1];
    keydownHandler({ key: "w" });
    expect(inputManager.keys["w"]).toBe(true);
  });

  it("should set key to false on keyup", () => {
    inputManager.init();
    // Simulate keydown first
    const keydownHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "keydown",
    )[1];
    keydownHandler({ key: "w" });
    expect(inputManager.keys["w"]).toBe(true);

    // Simulate keyup
    const keyupHandler = addEventListenerMock.mock.calls.find(
      (call) => call[0] === "keyup",
    )[1];
    keyupHandler({ key: "w" });
    expect(inputManager.keys["w"]).toBe(false);
  });
});
