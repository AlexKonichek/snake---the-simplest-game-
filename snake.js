const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the box (like a big pixel)
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "sound/dead.mp3";
eat.src = "sound/eat.mp3";
up.src = "sound/up.mp3";
right.src = "sound/right.mp3";
left.src = "sound/left.mp3";
down.src = "sound/down.mp3";

// create the snake array

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food with random coordinates

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score

let score = 0;


//control the snake
let dir;

document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if( key == 37 && dir != "RIGHT"){
        console.log(key)
        left.play();
        dir = "LEFT";
    }else if(key == 38 && dir != "DOWN"){
        dir = "UP";
        up.play();
    }else if(key == 39 && dir != "LEFT"){
        dir = "RIGHT";
        right.play();
    }else if(key == 40 && dir != "UP"){
        dir = "DOWN";
        down.play();
    }
}

// touch events for mobile version
/* document.addEventListener('touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    ctx.fillText("НЕ ЖМИ НА МЕНЯ!",3*box,6*box);
    }, false);

document.addEventListener('touchmove', function(event) {
        event.preventDefault();
        event.stopPropagation();
       
        }, false);

document.addEventListener('touchend', function(event) {
            event.preventDefault();
            event.stopPropagation();
            ctx.fillText("",5*box,6*box);
            }, false); */


// check collision 
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( dir == "LEFT") snakeX -= box;
    if( dir == "UP") snakeY -= box;
    if( dir == "RIGHT") snakeX += box;
    if( dir == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
        ctx.fillText("Game Over",5*box,6*box);
        ctx.fillText("Please, refresh the page",3*box,9*box);
    }
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// call draw function every 100 ms (instead RequestAnimFrame)

let game = setInterval(draw,300);


