/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker, fill, Qs, erase,noErase, rect, CONTROL, SPACEBAR*/

const SPACEBAR = 32;

const userName = Qs.parse(location.search,{
   ignoreQueryPrefix: true
 });

let backgroundColor = 51;
let drawingForm = document.getElementById("sketch-div");
let guessForm = document.getElementById("guessForm");

let colorPicker, paintbrush, socket, canv, isPlayerActive, gameStart = true;


function preload(){
  socket = io.connect();
  

}

function setup(){
  
  
  // javascript working space
  canv = createCanvas(400,400);
  canv.parent('sketch-div');
  
  
    if(isPlayerActive == true){
    window.location.replace("drawer.html")
    } else if(gameStart){
    window.location.replace("guesser.html")
    }
  
  paintbrush = new PaintBrush;
  
  socket.emit('playerJoin',userName);
  // background(backgroundColor);
  noStroke();
  colorPicker = createColorPicker('#ed225d');
  colorPicker.parent("color-picker");
  
 
  socket.on("mouse", (otherPersonPaintbrush) => {
      otherPersonPaintbrush.draw();
     });
  }

function draw()  {
  // This fucntion allows the background to change to whatever color is selected.\
  if(backgroundColor != colorPicker.color()) backgroundColor = colorPicker.color();
  drawingForm.style.backgroundColor = backgroundColor;
  
  if(mouseIsPressed){
    
    let mousePosition = {
      x: mouseX,
      y: mouseY,
      pX: pmouseX,
      pY: pmouseY
    };
    
    if(isPlayerActive){
      
    paintbrush.draw();
    socket.emit("mouse", paintbrush);
      
    }
  }
  
}
// whenever the spacebar key is pressed the screen changes the background color     
function keyPressed(){
  if(keyCode == SPACEBAR){
    canv = createCanvas(400,400);
    canv.parent("sketch-div");
  } else if (keyCode == CONTROL){
    paintbrush.isErasing = !paintbrush.isErasing;
  }
  
  
}

// it might be useful to make one of these 
class PaintBrush{
  constructor(){
    this.color = "white";
    this.mode = "LINE";
    this.isErasing = false;
    this.strokeWeight = 10;
    
    this.squarePoints = null;
  }
  
  draw(){
    stroke(this.color);
    fill(this.color);
    strokeWeight(this.strokeWeight);
    
    this.isErasing? erase(): noErase();
    
    if(this.mode == "LINE"){
      this.drawLine();
    } else if(this.mode == "RECT"){
      this.drawRect();
    }
  }
  
  drawLine(){
    line(mouseX,mouseY,pmouseX,pmouseY);
  }
  
  drawRect(){
    if(this.squarePoints === null){ 
      this.squarePoints = {
            x: mouseX,
            y: mouseY
        };
      console.log(this.squarePoints);
    } else{
      console.log(this.squarePoints);
      rect(this.squarePoints.x, this.squarePoints.y, this.sqaurePoints.x - mouseX);
    } 
  }
}

guessForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  
  socket.emit('guess', msg);
  
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


function drawLine(x,y,px,py){
    stroke('white');
    strokeWeight(10);
    line(x,y,px,py);
}



function eraserBrush()  {
  
}