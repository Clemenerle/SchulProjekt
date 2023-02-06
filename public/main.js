var canvas = document.getElementById('canvas');
var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');

var engine = new Game(ctx,width,height);
var player = new Player(engine,new Vector2D(0,Metric.km),new Vector2D(50,180 * Metric.cm));


engine.addGameobject(player);


function tick(){
    engine.updateAndDraw();
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);