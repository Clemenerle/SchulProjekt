class Game {
  gameobjects = [];
  deltaTime = 0;
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.frameStart = Date.now();
    this.frameEnd = Date.now();
  }

  updateAndDraw() {
    this.deltaTime = (this.frameEnd - this.frameStart) / 1000;
    if (this.deltaTime < 0.001) {
      this.deltaTime = 0.001;
    }
    this.frameStart = Date.now();

    this.ctx.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < this.gameobjects.length; i++) {
      this.gameobjects[i].update();
      this.gameobjects[i].draw();
    }

    this.frameEnd = Date.now();
  }

  addGameobject(obj) {
    this.gameobjects.push(obj);
    obj.onInit();
  }
}

class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

  jumpForce = 80;
  jumpTime = 8000;
  isOnGround = false;

  dDown = false;
  aDown = false;

  onInit() {
    //handle playerInput

    document.onkeydown = (event) => {
      if (event.key == " " && this.isOnGround) {
        let acc = this.jumpForce / this.mass;
        this.vel.y += acc * this.engine.deltaTime * this.jumpTime;
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
      this.vel.x = 6 * Metric.m * this.engine.deltaTime * 10;
    } else if (this.aDown) {
      this.vel.x = -6 * Metric.m * this.engine.deltaTime * 10;
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
  gridWidth = 0;
  gridHeight = 0;

  tiles = [[]];
  tileSize = new Vector2D(50, 50);

  update() {}

  onInit() {}
}
