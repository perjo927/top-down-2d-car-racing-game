# Top-Down 2D Car Racing Game

## Project Overview

This is a top-down 2D car racing game built using HTML, CSS, and Vanilla JavaScript with Pixi.js for rendering. The project emphasizes a modular, iterative, and testable development approach, starting with core mechanics and crude graphics before focusing on visual polish. The game is designed to be playable in web browsers on both desktop and mobile devices.

## Game Mechanics & Features

### Current Implementation

- **Top-Down 2D View:** Classic perspective for racing.
- **Crude Graphics:** Currently uses simple black rectangles for the car and basic shapes/colors for the track (grass and road).
- **WASD Controls:**
  - `W` / `w`: Accelerate
  - `S` / `s`: Brake / Reverse
  - `A` / `a`: Turn Left
  - `D` / `d`: Turn Right
- **Handbrake:** `Spacebar` to apply handbrake, increasing friction and allowing for drifts.
- **Basic Car Physics:**
  - Acceleration and deceleration.
  - Friction simulation.
  - Maximum speed limits.
  - Turning based on car speed.
- **Track Boundaries & Collision:**
  - An oval-shaped track with distinct "road" and "grass" areas.
  - Collision detection determines if the car is on or off the track.
  - **Off-Track Physics:** When on grass, the car experiences significantly increased friction, reduced maximum speed, and less grip (reduced turn speed), making it harder to control.
- **Checkpoints & Lap Timing:**
  - Multiple invisible checkpoints are defined along the track, including a start/finish line.
  - The car must pass through checkpoints in a specific sequence to validate a lap.
  - A `LapTimer` tracks the current lap time and records the last completed lap time.
  - Lap times are displayed on the screen.

### Future Development Roadmap

The following features are planned for future iterations:

- **Mobile Controls:** On-screen joystick for mobile devices.
- **Advanced Car Physics:**
  - All-wheel drive simulation.
  - Automatic transmission with 6 gears.
  - Max speed of 150 km/h.
  - Detailed collision physics with walls and other cars.
  - Varied surface responses (sliding, acceleration).
- **Dashboard:** In-game display for speed, gear, RPM, total time, and lap time.
- **Visual Effects:** Particles for slide marks and exhaust fumes.
- **Tile-Based Map:** Track design using a tile system.
- **Dynamic Camera:** Camera that keeps the car centered on the map, even if the map is larger than the screen.
- **Sound:** In-game audio effects and music.
- **High Score System:** Persistence of best lap times.
- **User Interface:** Main menu for game start, settings, and high scores.

## Development Approach & Architecture

The project follows a strict iterative and modular development methodology:

- **Iterative Development:** Features are built in small, testable increments. Each iteration focuses on proving a core mechanic or adding a single, isolated feature.
- **Modular Architecture:** The codebase is structured using Vanilla JavaScript classes, promoting isolation, decoupling, and reusability.
- **Testing:** We lean towards a test-driven approach when possible. We confirm features are working after modifying a file by running and revising/adding/removing tests. We use **Vitest** for unit testing.
- **Linting:** We use **ESLint** with Prettier for code style and quality enforcement.
- **Key Modules (Classes):**
  - `Game.js`: The main game orchestrator, responsible for initializing Pixi.js, managing game state, and updating game objects.
  - `Car.js`: Manages the car's physics, movement, and rendering.
  - `InputManager.js`: Handles keyboard input, abstracting it from game logic.
  - `Track.js`: Defines the track layout, including boundaries and checkpoints, and provides collision detection methods.
  - `LapTimer.js`: Manages lap timing, checkpoint progression, and displays time information.
- **Technology Stack:**
  - **Frontend:** HTML, CSS, Vanilla JavaScript.
  - **Rendering:** Pixi.js (WebGL/Canvas library for 2D graphics).
  - **Build Tool:** Vite (for development server and bundling).
- **Design Principles:**
  - **No SPA Frameworks:** Direct DOM manipulation is avoided; rendering is handled by Pixi.js.
  - **Vanilla CSS:** No CSS frameworks like Tailwind CSS are used.
  - **Crude Graphics First:** Emphasis is placed on proving game mechanics and physics before investing in detailed visual assets.
  - **No TypeScript:** We are only using vanilla JavaScript.
  - **No External Libraries (unless necessary):** We might introduce libraries if absolutely necessary and after explicit discussion.

## Setup and Running the Game

To set up and run the game locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd top-down-2d-car-racing-game
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The game should open in your browser at `http://localhost:8080`.

## Important Notes for AI Agent (Gemini)

This section serves as a prompt for future interactions and reinforces the project's core guidelines:

- **Per is the Master:** Acknowledge and respect the user's role.
- **Iterative & Modular:** Continue with the iterative development approach, focusing on one isolated feature at a time. Maintain the modular architecture using Vanilla JS classes.
- **Vanilla First:** Prioritize Vanilla JavaScript and CSS. Introduce external libraries only if absolutely necessary and after explicit discussion.
- **Crude Graphics:** Continue using crude graphics (black/white, shapes) until explicitly instructed to implement detailed visual assets (sprites, textures).
- **Confirmation:** Always ask for confirmation before making significant changes or implementing new features.
- **Error Handling:** Be diligent in testing and debugging. If an error occurs, identify and fix it promptly.
- **Context:** Remember the current state of the game (implemented features, known issues) in subsequent interactions.
- **Clarity:** Provide clear, concise explanations for proposed changes and implemented solutions.
- **No Assumptions:** Do not make assumptions about desired functionality or implementation details without clarification.