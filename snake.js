// Canvas & Context
canvas = document.getElementById("game_canvas");
context = canvas.getContext("2d");

//Width & Height of Canvas
const width = canvas.getAttribute('width');
const height = canvas.getAttribute('height');

// Game Box - 32 pixels
const box = 32;

// External Images
const groundImg = new Image();
groundImg.src = "/snake-game/snakeSpace.png";
const foodImg = new Image();
foodImg.src = "/snake-game/food.png";

// Snake
let snake =[];
snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// Snake Direction
let snakedir;

// Food
let food ={x: 0, y: 0};

// Score
let score;

//HTML
let screen_game;
let screen_menu;
let screen_gameover;
let button_start;
let button_restart;

// attaches an event handler (function/2nd param) to "specific event "(1st param)
document.addEventListener("keydown",direction);

// Defines Directions
function direction(event){
    let key = event.keyCode; //.keyCode returns a Unicode character number
    if( key == 37 && snakedir != "RIGHT"){
        snakedir = "LEFT";
    }else if(key == 38 && snakedir != "DOWN"){
        snakedir = "UP";
    }else if(key == 39 && snakedir != "LEFT"){
        snakedir = "RIGHT";
    }else if(key == 40 && snakedir != "UP"){
        snakedir = "DOWN";
    }
}

///////-------------------------------------------------------///////

// adds Food
function addFood(){
  food.x = Math.floor(Math.random()*17+1) * box;
  food.y = Math.floor(Math.random() *15+3) * box;
  for(var i = 0; i < snake.length; i++){
      if(checkBlock(food.x, food.y, snake[i].x, snake[i].y)){
          addFood();
       }
   }
}

///////-------------------------------------------------------///////

// returns true if two blocks are the same/ collide
function checkBlock(x1, y1, x2, y2){
   return ( x1 == x2 && y1 == y2) ? true : false; // if () is true then return true, else return false
 }

///////-------------------------------------------------------///////

// check collision function : returns true if blocks are same
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

///////-------------------------------------------------------///////

//makes rounded rectangle for snake's body
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}

////////////////////////////////////////////////////////////////////////////////
function newGame(){
  showScreen(0);
  screen_game.focus();

  snake =[];
  snake[0] = {
      x : 9 * box,
      y : 10 * box
  };
  snakedir = "";
  score = 0;

  addFood();
  main();
}

// Draws External Images
function drawGame(){
  context.drawImage(groundImg,0,0);
  context.drawImage(foodImg, food.x, food.y);
}

// Main Loop
function main(){

    drawGame();

    // Draws Snake
    for( let i = 0; i < snake.length ; i++){
        context.fillStyle = ( i == 0 )? "rgb(179, 255, 179)":"rgb(230, 255, 230)";
        roundRect(context,snake[i].x,snake[i].y,box,box,9, true, false);
    }


    // Current Head Coordinates
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;


    // Moves Snake
    if( snakedir == "LEFT") snakeX -= box;
    if( snakedir == "UP") snakeY -= box;
    if( snakedir == "RIGHT") snakeX += box;
    if( snakedir == "DOWN") snakeY += box;


    // If Snake Eats Food
    if(checkBlock(snakeX, snakeY, food.x, food.y)){
        score++;
        addFood();
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }

    // New Head Coordinates
    let newHead = {
        x : snakeX,
        y : snakeY
    };

    // If Snake hits Wall or Itself
    if(snakeX < 0 || snakeX > 18 * box || snakeY <2*box || snakeY > 18*box || collision(newHead,snake)){
        //clearInterval(gameLoop); // clearInterval clears a timer set by setInterval()
        showScreen(2);
        screen_gameover.focus();
    }

    // .unshift adds new items to beginning of an array
    snake.unshift(newHead);

//---------------------

    // Scorecard
    context.fillStyle = "white";
    context.font = "15px Inconsolata";
    context.fillText("score: "+score,2*box,1.6*box);
}

function clear() {
  context.clearRect(0,0,width,height);
}

////////////////////////////////////////////////////////////////////////////////

let showScreen = function(screen_opt){
    switch(screen_opt){

// 0 for the game
// 1 for the main menu
// 2 for the game over screen
        case 0:  screen_game.style.display = "block";
                 screen_menu.style.display = "none";
                 screen_gameover.style.display = "none";
                 break;

        case 1:  screen_game.style.display = "none";
                 screen_menu.style.display = "block";
                 screen_gameover.style.display = "none";
                 break;

        case 2: screen_game.style.display = "none";
                screen_menu.style.display = "none";
                screen_gameover.style.display = "block";
                break;
    }
}
////////////////////////////////////////////////////////////////////////////////

// on window load screens and basics
window.onload = function() {

      // Screens
      screen_menu = document.getElementById("start_menu");
      screen_game = document.getElementById("game_canvas");
      screen_gameover = document.getElementById("gameover_menu");

      // Buttons
      button_start= document.getElementById("start");
      button_restart = document.getElementById("restart");

      // etc
      //ele_score = document.getElementById("score_value");

  // --------------------

  button_start.onclick = function(){newGame();};
  button_restart.onclick = function(){newGame();};

  function myFunction() {
  document.getElementsByTagName("BODY")[0].style.backgroundColor = "yellow";
}


  //showScreen("start_menu");

  /*document.onkeydown = fucntion(evt){
    if(screen_gameover.style.display == "block"){
      evt = evt || window.event;
    if(evt.keyCode == 32){
              newGame();
          }
        }
      }*/
  }

/* function restartGame() {
  document.getElementById("gameOver").style.display = "none";
}
*/

// call draw function every 100 ms

let gameLoop = setInterval(main,100);
