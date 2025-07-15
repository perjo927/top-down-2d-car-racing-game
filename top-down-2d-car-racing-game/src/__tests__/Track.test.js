import { describe, it, expect, beforeEach, vi } from "vitest";
import { Track } from "../Track";
import { Rectangle } from "pixi.js";

// Mock Pixi.js Graphics
vi.mock("pixi.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Graphics: vi.fn(() => ({
      rect: vi.fn(),
      fill: vi.fn(),
      ellipse: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    })),
  };
});

describe("Track", () => {
  let mockApp;
  let track;

  beforeEach(() => {
    mockApp = {
      screen: {
        width: 800,
        height: 600,
      },
    };
    track = new Track(mockApp);
  });

  it("should initialize track properties correctly", () => {
    expect(track.trackWidth).toBe(100);
    expect(track.centerX).toBe(mockApp.screen.width / 2);
    expect(track.centerY).toBe(mockApp.screen.height / 2);
    expect(track.outerRadiusX).toBe(mockApp.screen.width / 2 - 50);
    expect(track.outerRadiusY).toBe(mockApp.screen.height / 2 - 50);
    expect(track.innerRadiusX).toBe(track.outerRadiusX - track.trackWidth);
    expect(track.innerRadiusY).toBe(track.outerRadiusY - track.trackWidth);
  });

  it("should call graphics methods to draw the track", () => {
    expect(track.graphics.rect).toHaveBeenCalledWith(
      0,
      0,
      mockApp.screen.width,
      mockApp.screen.height,
    );
    expect(track.graphics.fill).toHaveBeenCalledWith(0x009900); // Grass color
    expect(track.graphics.ellipse).toHaveBeenCalledWith(
      track.centerX,
      track.centerY,
      track.outerRadiusX,
      track.outerRadiusY,
    );
    expect(track.graphics.fill).toHaveBeenCalledWith(0x333333); // Track color
    expect(track.graphics.ellipse).toHaveBeenCalledWith(
      track.centerX,
      track.centerY,
      track.innerRadiusX,
      track.innerRadiusY,
    );
    expect(track.graphics.fill).toHaveBeenCalledWith(0x009900); // Inner grass color
  });

  it("should define four checkpoints", () => {
    expect(track.checkpoints).toBeInstanceOf(Array);
    expect(track.checkpoints.length).toBe(4);
    track.checkpoints.forEach((cp) => {
      expect(cp).toBeInstanceOf(Rectangle);
    });
  });

  it("should correctly identify points on track", () => {
    // Point in the middle of the track (between inner and outer ellipses)
    const onTrackX =
      track.centerX + (track.innerRadiusX + track.outerRadiusX) / 2;
    const onTrackY = track.centerY;
    expect(track.isOffTrack(onTrackX, onTrackY)).toBe(false);

    // Another point on track
    const onTrackX2 = track.centerX;
    const onTrackY2 =
      track.centerY + (track.innerRadiusY + track.outerRadiusY) / 2;
    expect(track.isOffTrack(onTrackX2, onTrackY2)).toBe(false);
  });

  it("should correctly identify points off track (outside outer ellipse)", () => {
    const offTrackX = track.centerX + track.outerRadiusX + 10;
    const offTrackY = track.centerY;
    expect(track.isOffTrack(offTrackX, offTrackY)).toBe(true);

    const offTrackX2 = track.centerX;
    const offTrackY2 = track.centerY + track.outerRadiusY + 10;
    expect(track.isOffTrack(offTrackX2, offTrackY2)).toBe(true);
  });

  it("should correctly identify points off track (inside inner ellipse)", () => {
    const offTrackX = track.centerX;
    const offTrackY = track.centerY;
    expect(track.isOffTrack(offTrackX, offTrackY)).toBe(true);

    const offTrackX2 = track.centerX + track.innerRadiusX / 2;
    const offTrackY2 = track.centerY + track.innerRadiusY / 2;
    expect(track.isOffTrack(offTrackX2, offTrackY2)).toBe(true);
  });
});
