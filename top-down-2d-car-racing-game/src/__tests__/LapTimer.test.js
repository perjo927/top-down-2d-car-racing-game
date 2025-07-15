import { describe, it, expect, beforeEach, vi } from "vitest";
import { LapTimer } from "../LapTimer";

describe("LapTimer", () => {
  let mockApp;
  let mockTrack;
  let lapTimer;
  let mockCar;

  beforeEach(() => {
    mockApp = {
      stage: {
        addChild: vi.fn(),
      },
    };
    mockTrack = {
      checkpoints: [
        { contains: vi.fn(() => false) }, // Checkpoint 0 (Start/Finish)
        { contains: vi.fn(() => false) }, // Checkpoint 1
        { contains: vi.fn(() => false) }, // Checkpoint 2
      ],
    };
    lapTimer = new LapTimer(mockApp, mockTrack);
    mockCar = { x: 0, y: 0 }; // Simple car mock

    // Mock Date.now() for consistent time testing
    vi.useFakeTimers();
    vi.setSystemTime(1000); // Set initial time to 1000ms (1 second) to avoid 0 for lapStartTime
  });

  it("should create a LapTimer instance with initial state", () => {
    expect(lapTimer).toBeDefined();
    expect(lapTimer.nextCheckpoint).toBe(0);
    expect(lapTimer.lapStartTime).toBe(0);
    expect(lapTimer.currentLapTime).toBe(0);
    expect(lapTimer.lastLapTime).toBe(0);
    expect(mockApp.stage.addChild).toHaveBeenCalled();
  });

  it("should start a lap when passing the first checkpoint (checkpoint 0)", () => {
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);

    expect(lapTimer.lapStartTime).toBe(1000); // Date.now() is mocked to 1000
    expect(lapTimer.nextCheckpoint).toBe(1);
    expect(lapTimer.currentLapTime).toBe(0); // Current lap time is 0 at the start of the lap
    expect(lapTimer.lastLapTime).toBe(0);
  });

  it("should progress to the next checkpoint in sequence", () => {
    // Pass checkpoint 0 to start lap
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[0].contains.mockReturnValue(false); // Car leaves checkpoint

    // Pass checkpoint 1
    mockTrack.checkpoints[1].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    expect(lapTimer.nextCheckpoint).toBe(2);
  });

  it("should complete a lap and record last lap time", () => {
    // Start lap
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[0].contains.mockReturnValue(false);

    vi.setSystemTime(11000); // Advance time by 10 seconds (1000 + 10000)

    // Pass all checkpoints
    mockTrack.checkpoints[1].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[1].contains.mockReturnValue(false);

    mockTrack.checkpoints[2].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[2].contains.mockReturnValue(false);

    // Pass checkpoint 0 again to complete lap
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);

    expect(lapTimer.lastLapTime).toBeCloseTo(10);
    expect(lapTimer.lapStartTime).toBe(11000); // New lap started at 11 seconds
    expect(lapTimer.nextCheckpoint).toBe(1);
  });

  it("should update current lap time", () => {
    // Start lap
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[0].contains.mockReturnValue(false);

    vi.setSystemTime(6000); // Advance time by 5 seconds (1000 + 5000)
    lapTimer.update(mockCar);
    expect(lapTimer.currentLapTime).toBeCloseTo(5);

    vi.setSystemTime(8500); // Advance time by another 2.5 seconds (6000 + 2500)
    lapTimer.update(mockCar);
    expect(lapTimer.currentLapTime).toBeCloseTo(7.5);
  });

  it("should not progress checkpoint if out of sequence", () => {
    // Start lap
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[0].contains.mockReturnValue(false);

    // Try to pass checkpoint 2 instead of 1
    mockTrack.checkpoints[2].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    expect(lapTimer.nextCheckpoint).toBe(1); // Should still be 1
  });

  it("should not progress checkpoint if out of sequence", () => {
    // Start lap
    mockTrack.checkpoints[0].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    mockTrack.checkpoints[0].contains.mockReturnValue(false);

    // Try to pass checkpoint 2 instead of 1
    mockTrack.checkpoints[2].contains.mockReturnValue(true);
    lapTimer.update(mockCar);
    expect(lapTimer.nextCheckpoint).toBe(1); // Should still be 1
  });
});
