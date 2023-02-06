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
    if(this.deltaTime < 0.001){
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
  }
}

class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Gameobject {
  update = () => {};
  draw = () => {};

  constructor(engine, pos, size) {
    this.engine = engine;
    this.pos = pos;
    this.size = size;
  }
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
  mass = 1;
  vel = new Vector2D(0, 0);
  acc = new Vector2D(0, 0);

  update = () => {
    if(this.pos.y <= 0){
      this.vel.y = 0;
      this.pos.y = 0;
    }
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.addGravity();
  };

  draw = () => {
    ctx.fillRect(
      this.pos.x,
      this.engine.height - this.pos.y - this.size.y,
      this.size.x,
      this.size.y
    );
  };

  addGravity(){
    this.vel.y += -Metric.g * Metric.m * engine.deltaTime;
  }

}
