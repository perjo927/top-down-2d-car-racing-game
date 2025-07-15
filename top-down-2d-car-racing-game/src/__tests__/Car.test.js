import { describe, it, expect, beforeEach } from "vitest";
import { Car } from "../Car";

describe("Car", () => {
  let mockApp;
  let mockInputManager;
  let mockTrack;
  let car;
  let deltaTime = 1; // Assuming a fixed deltaTime for consistent physics updates

  beforeEach(() => {
    mockApp = {
      screen: {
        width: 800,
        height: 600,
      },
    };
    mockInputManager = {
      keys: {},
    };
    mockTrack = {
      outerRadiusY: 100,
      isOffTrack: () => false, // Default to on-track
    };
    car = new Car(mockApp, mockInputManager, mockTrack);
    car.speed = 0; // Reset speed for each test
    car.angle = 0; // Reset angle for each test
  });

  it("should create a car instance", () => {
    expect(car).toBeDefined();
    expect(car.x).toBe(mockApp.screen.width / 2);
    expect(car.y).toBe(mockApp.screen.height / 2 - mockTrack.outerRadiusY - 50);
    expect(car.angle).toBe(0);
    expect(car.speed).toBe(0);
  });

  it('should accelerate when "w" key is pressed', () => {
    mockInputManager.keys["w"] = true;
    car.update({ deltaTime });
    expect(car.speed).toBeGreaterThan(0);
    expect(car.speed).toBe(car.acceleration - car.friction);
  });

  it('should brake/reverse when "s" key is pressed', () => {
    car.speed = 1; // Give car some initial speed
    mockInputManager.keys["s"] = true;
    car.update({ deltaTime });
    expect(car.speed).toBeLessThan(1);
    expect(car.speed).toBeCloseTo(1 - car.acceleration - car.friction);

    car.speed = 0; // Test reverse from standstill
    car.update({ deltaTime });
    expect(car.speed).toBeLessThan(0);
    expect(car.speed).toBeCloseTo(-car.acceleration + car.friction); // When reversing from 0, speed becomes negative, then friction adds to it (makes it less negative)
  });

  it("should apply friction when no acceleration keys are pressed", () => {
    car.speed = 1;
    mockInputManager.keys = {}; // No keys pressed
    car.update({ deltaTime });
    expect(car.speed).toBeLessThan(1);
    expect(car.speed).toBeCloseTo(1 - car.friction);
  });

  it("should apply handbrake friction when spacebar is pressed", () => {
    car.speed = 1;
    mockInputManager.keys[" "] = true; // Spacebar for handbrake
    car.update({ deltaTime });
    expect(car.speed).toBeLessThan(1);
    expect(car.speed).toBeCloseTo(1 - car.friction * 2); // Handbrake applies double friction
  });

  it('should turn left when "a" key is pressed and car is moving forward', () => {
    car.speed = 1;
    mockInputManager.keys["a"] = true;
    car.update({ deltaTime });
    expect(car.angle).toBeLessThan(0);
    expect(car.angle).toBeCloseTo(-car.turnSpeed);
  });

  it('should turn right when "d" key is pressed and car is moving forward', () => {
    car.speed = 1;
    mockInputManager.keys["d"] = true;
    car.update({ deltaTime });
    expect(car.angle).toBeGreaterThan(0);
    expect(car.angle).toBeCloseTo(car.turnSpeed);
  });

  it('should turn left when "a" key is pressed and car is moving backward', () => {
    car.speed = -1;
    mockInputManager.keys["a"] = true;
    car.update({ deltaTime });
    expect(car.angle).toBeGreaterThan(0); // Angle increases when turning left in reverse
    expect(car.angle).toBeCloseTo(car.turnSpeed);
  });

  it('should turn right when "d" key is pressed and car is moving backward', () => {
    car.speed = -1;
    mockInputManager.keys["d"] = true;
    car.update({ deltaTime });
    expect(car.angle).toBeLessThan(0); // Angle decreases when turning right in reverse
    expect(car.angle).toBeCloseTo(-car.turnSpeed);
  });

  it("should clamp speed to maxSpeed", () => {
    car.speed = car.maxSpeed + 1; // Exceed max speed
    car.update({ deltaTime });
    expect(car.speed).toBeCloseTo(car.maxSpeed);
  });

  it("should clamp speed to negative maxSpeed / 2", () => {
    car.speed = -(car.maxSpeed / 2) - 1; // Exceed reverse max speed
    car.update({ deltaTime });
    expect(car.speed).toBeCloseTo(-(car.maxSpeed / 2));
  });

  it("should reduce speed and turn speed when off track", () => {
    mockTrack.isOffTrack = () => true; // Simulate being off track
    car.speed = 5;
    mockInputManager.keys["w"] = true; // Try to accelerate
    mockInputManager.keys["d"] = true; // Try to turn
    car.update({ deltaTime });

    // Expect speed to be less than normal acceleration due to increased friction
    expect(car.speed).toBeLessThan(5 + car.acceleration);
    // Expect turn angle to be less than normal turn speed
    expect(car.angle).toBeLessThan(car.turnSpeed);
  });
});
