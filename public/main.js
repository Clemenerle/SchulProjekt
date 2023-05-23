var canvas = document.getElementById("canvas");
var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
//initialize gameengine
var engine = new Game(ctx, width, height);

//define worldgenerator
var worldGen = new WorldGenerator(
  engine,
  new Vector2D(0, 0),
  new Vector2D(0, 0),
  "worldGenerator"
);
//define player
var player = new Player(
  engine,
  new Vector2D(engine.width / 2 - 50 / 2, Metric.m * 5),
  new Vector2D(50, 180 * Metric.cm),
  "player"
);
//add gameobjects to engine
engine.addGameobject(player);
engine.addGameobject(worldGen);
console.log(engine.gameobjects);
//start game loop
function tick() {
  engine.updateAndDraw();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
