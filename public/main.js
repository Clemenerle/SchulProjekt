var canvas = document.getElementById('canvas');
var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');

var engine = new Game(ctx,width,height);
var player = new Player(engine,new Vector2D(0,100),new Vector2D(50,50));


engine.addGameobject(player);

player.addForce(new Vector2D(0,-0.1));

function tick(){
    engine.updateAndDraw();
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);


document.onkeydown = (event)=>{
    if(event.key == " "){
        player.vel.y = 5;
    }
}