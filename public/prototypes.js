class Game {
  gameobjects = [];
  deltaTime = 0;

  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.frameStart = performance.now();
    this.frameEnd = performance.now();
  }

  updateAndDraw() {
    this.deltaTime = (this.frameEnd - this.frameStart) / 100;
    if (this.deltaTime == 0) {
      this.deltaTime = 0.001;
    }
    this.frameStart = performance.now();

    this.ctx.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < this.gameobjects.length; i++) {
      this.gameobjects[i].update();
      this.gameobjects[i].draw();
    }

    this.frameEnd = performance.now();
  }

  addGameobject(obj) {
    this.gameobjects.push(obj);
    obj.onInit();
  }

  findGameobject(name) {
    return this.gameobjects.find((obj) => obj.name == name);
  }
}

class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(vec1, vec2) {
    return Math.sqrt(
      Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2)
    );
  }
}

class Gameobject {
  constructor(engine, pos, size, name) {
    this.engine = engine;
    this.pos = pos;
    this.size = size;
    this.name = name;
  }
  onInit() {}
  update() {}
  draw() {}
}

class Metric {
  static km = 5000;
  static m = 50;
  static dm = 5;
  static cm = 0.5;
  static mm = 0.05;
  static g = 9.807;
}

class Player extends Gameobject {
  //mass in kg
  mass = 80;
  //vel in m/s
  vel = new Vector2D(0, 0);

  jumpForce = 200;
  jumpTime = 5000;
  isOnGround = false;

  dDown = false;
  aDown = false;

  onInit() {
    //handle playerInput
    document.onkeydown = (event) => {
      if (event.key == " " && this.isOnGround) {
        let acc = this.jumpForce / this.mass;
        this.vel.y += acc * this.engine.deltaTime * this.jumpTime;
        console.log(this.engine.deltaTime);
      }

      if (event.key == "d") this.dDown = true;
      if (event.key == "a") this.aDown = true;
    };

    document.onkeyup = (event) => {
      if (event.key == "d") this.dDown = false;
      if (event.key == "a") this.aDown = false;
    };
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.checkGround();
    this.colisionHandler();
    this.addGravity();
    this.move();
  }

  move() {
    if (this.dDown) {
      this.vel.x = 10 * Metric.m * this.engine.deltaTime * 10;
    } else if (this.aDown) {
      this.vel.x = -10 * Metric.m * this.engine.deltaTime * 10;
    } else {
      this.vel.x = 0;
    }
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.pos.x,
      this.engine.height - this.pos.y - this.size.y,
      this.size.x,
      this.size.y
    );
  }

  addGravity() {
    this.vel.y += -Metric.g * Metric.m * engine.deltaTime;
  }

  colisionHandler() {
    if (this.pos.y < 0) {
      this.vel.y = 0;
      this.pos.y = 0;
    }
  }

  checkGround() {
    if (this.pos.y <= 0) {
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }
  }
}

class Tile extends Gameobject {
  type = 0;

  onInit() {
    console.log(this.pos);
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.pos.x,
      this.engine.height - this.pos.y - this.size.y,
      this.size.x,
      this.size.y
    );
  }
}

class WorldGenerator extends Gameobject {
  gridWidth = 0; // Number of tiles in the grid horizontally
  gridHeight = 0; // Number of tiles in the grid vertically

  playerInstance = null; // Reference to the player game object

  tiles = [[]]; // 2D array to store the tiles
  tileSize = new Vector2D(50, 50); // Size of each tile

  update() {
    // Update the positions of the tiles based on the current position and tile size
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].pos.x = this.pos.x + x * this.tileSize.x;
        this.tiles[x][y].pos.y = this.pos.y + y * this.tileSize.y;
      }
    }
    
    // Update the position of the player instance
    this.playerInstance.pos.x -= 6 * Metric.m * this.engine.deltaTime * 10;
    
    // Shift the world position to the left and regenerate the column of tiles
    if (this.pos.x >= -this.tileSize.x) {
      this.pos.x -= 6 * Metric.m * this.engine.deltaTime * 10;
    } else if (this.pos.x <= -this.tileSize.x) {
      this.pos.x = 0;
      this.shiftColumn();
    }
  }

  onInit() {
    // Initialize the player instance and calculate grid dimensions
    this.playerInstance = this.engine.findGameobject("player");
    this.gridWidth = this.engine.width / this.tileSize.x + 1;
    this.gridHeight = this.engine.height / this.tileSize.y;
    
    // Generate initial columns of tiles
    for (let i = 0; i < this.gridWidth; i++) {
      this.generateColumn();
    }
    
    console.log(this.engine.findGameobject("player"));
  }

  draw() {
    // Draw all the tiles
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].draw();
      }
    }
  }

  maxGroundHeight = 1; // Maximum height of the ground
  minGroundHeight = 0; // Minimum height of the ground
  chunkSize = 5; // Number of tiles in each chunk
  chunkPos = 0; // Current position within the chunk
  groundHeight = 0; // Current ground height
  groundHeightChange = 0; // Change in ground height

  generateColumn() {
    // Generate tiles for the current column based on the ground height
    for (let y = 0; y < this.gridHeight; y++) {
      if (y <= this.groundHeight) {
        this.tiles[this.tiles.length - 1].push(
          new Tile(
            this.engine,
            new Vector2D(
              this.pos.x + (this.tiles.length - 1) * this.tileSize.x,
              this.pos.y + y * this.tileSize.y
            ),
            this.tileSize,
            "tile"
          )
        );
      }
    }

    // Update ground height and chunk properties
    if (this.chunkPos == this.chunkSize) {
      this.groundHeightChange = Math.floor(Math.random() * 5) - 2;
      if (this.groundHeight + this.groundHeightChange > this.maxGroundHeight) {
        this.groundHeightChange = -1;
      }
      if (this.groundHeight + this.groundHeightChange < this.minGroundHeight) {
        this.groundHeightChange = 1;
      }
      this.groundHeight += this.groundHeightChange;
      this.chunkPos = 0;
      this.chunkSize = Math.floor(Math.random() * 2) + 3;
    }
    this.chunkPos++;
    this.tiles.push([]);
  }

  shiftColumn() {
    // Shift the leftmost column of tiles and generate a new column
    this.tiles.shift();
    this.generateColumn();
  }

  getTiles() {
    // Return the tiles array
    return this.tiles;
  }
}
