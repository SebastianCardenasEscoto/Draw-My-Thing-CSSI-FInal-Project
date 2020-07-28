/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight*/

const SPACEBAR = 32;
let img ;
let socket;
let guessForm = document.getElementById("guessForm");

// importimg image


function setup(){
  
  // javascript working space
  let canv = createCanvas(400,400);
  canv.center();
  socket = io.connect();
  background(51);
  noStroke();
 

}

function draw()  {

  if(mouseIsPressed){
    stroke('white');
    strokeWeight(10);
    line(mouseX,mouseY,pmouseX,pmouseY);
    
    let mousePosition = {
      x: mouseX,
      y: mouseY
    };
    
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
