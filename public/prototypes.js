class Game {
  gameobjects = [];

  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  updateAndDraw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < this.gameobjects.length; i++) {
      this.gameobjects[i].update();
      this.gameobjects[i].draw();
    }
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

class Player extends Gameobject {

    mass = 1;
    vel = new Vector2D(0,0);
    acc = new Vector2D(0,0);

  update = () => {
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    if(this.pos.y < 0){
        this.pos.y = 0;
    }
  };

  draw = () => {
    ctx.fillRect(
      this.pos.x,
      this.engine.height - this.pos.y - this.size.y,
      this.size.x,
      this.size.y
    );
  };

  addForce(dir){
    this.acc.x = dir.x / this.mass;
    this.acc.y = dir.y / this.mass;
  }
}
