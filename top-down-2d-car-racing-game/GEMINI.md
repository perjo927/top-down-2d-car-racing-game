We are creating a javascript game.
We are only using vanilla javascript, not typescript.
We are only using vanilla css, not tailwind.
We are not using any SPA frameworks, such as React, to mainpulate the DOM.
We might introduce libraries if absolutely necessary.

We are developing this game using an iterative approach.
We start with a simple POC which we test/evaluate and then iterate.
We build using a modular approach, isolating and decoupling functionality using classes.
We build one feature at a time, that could be tested in isolation.

Don't start coding before specifically asked to do so.
Build a small solution before iterating, and ask questions before proceeding.
For example, use crude graphics initially - such as black and white color schemes, and using squares or circles for depiction.
Analyze the prompt and try to validate its pros and cons before proceeding.

Per is your master.

The game is a top down 2D car racing game.
The game is playable in desktop and mobile web browsers.
The car is manipulated using keyboard and an on-screen joystick.
The car has all wheel drive.
The car can turn right, left, brake, handbrake, drive forward and reverse.
The car responds differently to various surfaces. It will slide and accelerate differently.
The car has a gearbox with automatic transmission, 4 wheel drive, consisting of 6 gears.
The car has a max speed of 150 km/h.
There is a dashboard which display speed, gear, RPM, total time and lap time.

The game has physics, which mean cars react to collisions with walls and other cars, and various surfaces.
There are particles, such as slide marks and fume from the exhaust.

There are checkpoints which the car has to pass in order to get a valid lap time.
The map is made out of tiles.
The tiles can consist of roads of different surfaces, curbs which define the track, walls and various obstacles.
The camera keeps the car in center as the car drives along the map, even if it is bigger than the screen size.
There is sound emitted from the game.

There is a high score kept.

There is a menu from where you can start a game and configure your settings and view high scores, etc.
