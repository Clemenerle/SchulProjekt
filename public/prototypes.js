class Game {
  gameobjects = [];
  deltaTime = 0;
  isRunnging = true;
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.frameStart = performance.now();
    this.frameEnd = performance.now();
  }

  updateAndDraw() {
    if (this.isRunnging) {
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
  tiles = [[]];
  texture = undefined;
  dDown = false;
  aDown = false;

  

  onInit() {
    //handle playerInput
    document.onkeydown = (event) => {
      if (event.key == " " && this.isOnGround) {
        this.isOnGround = false;
        let acc = this.jumpForce / this.mass;
        this.vel.y += acc * this.engine.deltaTime * this.jumpTime;
      }
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
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.drawImage(
      this.texture,
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
    if (this.pos.y <= 0) {
      this.vel.y = 0;
      this.pos.y = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }

    for (let i = 0; i < this.tiles.length; i++) {
      let obstacle = this.tiles[i];
      if (obstacle == undefined) continue;
      if (
        this.pos.x + this.size.x >= obstacle.pos.x &&
        this.pos.x <= obstacle.pos.x + obstacle.size.x
      ) {
        if (this.pos.y <= obstacle.pos.y + obstacle.size.y) {
          this.vel.x = 0;
          this.engine.isRunnging = false;
        }
      }
    }
  }

  checkGround() {
    if (this.pos.y <= 0) {
      this.pos.y = 0;
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
  obstacles = [];
  obstacleInterval = 3;
  obstacleSpeed = 10;
  timer = 0;
  score = 0;
  onInit() {
    this.generateObstacles();
    let playerInstance = this.engine.findGameobject("player");
    playerInstance.tiles = this.obstacles;
  }

  update() {
    this.timer += this.engine.deltaTime * 10;
    if (this.timer >= this.obstacleInterval) {
      this.obstacleInterval = Math.random() * 1 + 0.4;
      this.obstacleSpeed += 0.2;
      this.timer = 0;
      this.generateObstacles();
    }

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].pos.x -=
        this.obstacleSpeed * Metric.m * this.engine.deltaTime * 10;
      if (this.obstacles[i].pos.x < 0 - this.obstacles[i].size.x) {
        this.obstacles.splice(i, 1);
        this.score++;
      }
    }
  }

  generateObstacles() {
    this.obstacles.push(
      new Tile(
        this.engine,
        new Vector2D(this.engine.width, 0),
        new Vector2D(50 * Metric.cm, 1.5 * Metric.m),
        "tile"
      )
    );
  }

  draw() {
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].draw();
    }
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + this.score, this.engine.width - 150, 30);
  }
}
