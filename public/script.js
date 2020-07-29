/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker, fill*/

const SPACEBAR = 32;
let backgroundColor = 51;
let drawingForm = document.getElementById("sketch-div");
let guessForm = document.getElementById("guessForm");

let colorPicker, paintbrush, socket,canv, isPlayerActive = false;


function setup(){
  
  socket = io.connect();
  // javascript working space
  canv = createCanvas(400,400);
  canv.parent('sketch-div');
  
  paintbrush = new PaintBrush;
  
  // background(backgroundColor);
  noStroke();
  colorPicker = createColorPicker('#ed225d');
  colorPicker.parent("color-picker");
  
 
  socket.on("mouse", (otherPersonMouse) => {
    drawLine(otherPersonMouse.x, otherPersonMouse.y,
                     otherPersonMouse.pX, otherPersonMouse.pY);
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
    
    paintbrush.draw();
    
    socket.emit("mouse", mousePosition);
  }
  
}
// whenever the spacebar key is pressed the screen changes the background color     
function keyPressed(){
  if(keyCode == SPACEBAR){
    canv = createCanvas(400,400);
    canv.parent("sketch-div");
  }
  
  
}

// it might be useful to make one of these 
class PaintBrush{
  constructor(){
    this.color = "white";
    this.mode = "LINE";
    this.strokeWeight = 10;
  }
  
  draw(){
    stroke(this.color);
    fill(this.color);
    strokeWeight(this.strokeWeight);
    
    if(this.mode == "LINE"){
      this.drawLine();
    }
  }
  
  drawLine(){
    line(mouseX,mouseY,pmouseX,pmouseY);
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

