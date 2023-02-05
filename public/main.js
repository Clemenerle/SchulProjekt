var canvas = document.getElementById ("canvas");
var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');

var engine = new Game(ctx,width,height);
var player = new Player(engine,new Vector2d(100,50), new Vector2d(50,50))
engine.addGameObject(player);

player.addForce(new Vector2d(0,-0.05))

function tick(){
   engine.updateAndDraw();
    requestAnimationFrame(tick);

}

requestAnimationFrame(tick);

document.onkeydown = (event) =>{
    if(event.key == " "){
        player.vel.y = 3;
    }
}
