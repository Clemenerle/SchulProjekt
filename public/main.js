var canvas = document.getElementById("canvas");
var width = 2488;
var height = 1200;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
// Das Canvas-Element und seine Größe werden festgelegt

var engine = new Game(ctx, width, height);
// Eine neue Spielengine wird erstellt

var worldGen = new WorldGenerator(
  engine,
  new Vector2D(0, 0),
  new Vector2D(0, 0),
  "worldGenerator"
);
// Ein neuer WorldGenerator (Weltgenerator) wird erstellt

var player = new Player(
  engine,
  new Vector2D(3 * Metric.m, Metric.m * 5),
  new Vector2D(50, 180 * Metric.cm),
  "player"
);
// Ein neuer Player (Spieler) wird erstellt

player.texture = document.getElementById("bild1");
// Die Textur des Spielers wird festgelegt (vermutlich ein Bild mit der ID "bild1")

engine.addGameobject(player);
engine.addGameobject(worldGen);
// Der Spieler und der Weltgenerator werden der Spielengine hinzugefügt

console.log(engine.gameobjects);
// Die Liste der Gameobjects (Spielobjekte) in der Spielengine wird ausgegeben

setInterval(() => {
  engine.updateAndDraw();
}, 16.666666666666668);
// Die Spiele-Schleife wird gestartet. Die updateAndDraw-Methode der Spielengine wird alle 16.67 Millisekunden aufgerufen.


