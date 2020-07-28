/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker*/

const SPACEBAR = 32;
let colorPicker;
let socket;
let guessForm = document.getElementById("guessForm");

// importimg image


function setup(){
  
  // javascript working space
  let canv = createCanvas(400,400);
  canv.parent('sketch-div');
  socket = io.connect();
  background(51);
  noStroke();
  colorPicker = createColorPicker('#ed225d');
  colorPicker.position(0, height + 5);
  //commented them out just to show something working during standup
 
  socket.on("mouse", (otherPersonMouse) => {
    drawLine(otherPersonMouse.x, otherPersonMouse.y,
                     otherPersonMouse.pX, otherPersonMouse.pY);
     });
}

function draw()  {

  // background(colorPicker.color());
  
  if(mouseIsPressed){
    
    let mousePosition = {
      x: mouseX,
      y: mouseY,
      pX: pmouseX,
      pY: pmouseY
    };
    
    drawLine(mouseX,mouseY,pmouseX,pmouseY);
    
    
    socket.emit("mouse", mousePosition);
  }
  
}
// whenever the spacebar key is pressed the screen changes the background color     
function keyPressed(){
  if(keyCode == SPACEBAR){
    background(51);
  }
  
  
}

// it might be useful to make one of these 
class PaintBrush{
  constructor(){
    this.color;
    this.mode;
    this.strokeWidth;
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