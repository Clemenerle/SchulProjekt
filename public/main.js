var canvas = document.getElementById('canvas');
var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');

var engine = new Game(ctx,width,height);
var worldGen = new WorldGenerator(engine,new Vector2D(0,0),new Vector2D(0,0),"worldGenerator")
var player = new Player(engine,new Vector2D(0,Metric.m * 5),new Vector2D(50,180 * Metric.cm),"palyer");
engine.addGameobject(worldGen);
engine.addGameobject(player);
console.log(engine.gameobjects)


function tick(){
    engine.updateAndDraw();
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);