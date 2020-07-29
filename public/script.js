/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker*/

const SPACEBAR = 32;
let backgroundColor = 51;
let colorPicker;
let socket,canv;
let guessForm = document.getElementById("guessForm");
let drawingForm = document.getElementById("sketch-div");
var timeleft = 90;
var startTime = 0;
var currentTime = 0;
var min = floor(s / 60);
var sec = s % 60;
var params = getURLParams();
var min = params.minute;
var timer = select('#timer');
var interval = setInterval(timeIt, 1000);



function setup(){
  
  // javascript working space
  canv = createCanvas(400,400);
  canv.parent('sketch-div');
  socket = io.connect();
  // background(backgroundColor);
  noStroke();
  colorPicker = createColorPicker('#ed225d');
  colorPicker.parent("color-picker");
  //commented them out just to show something working during standup
 
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
    
    drawLine(mouseX,mouseY,pmouseX,pmouseY);
    
    
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

