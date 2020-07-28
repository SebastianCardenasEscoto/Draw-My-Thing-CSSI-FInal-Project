/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, image, mouseIsPressed, stroke,
strokeWeight, keyCode, noStroke, io*/

const SPACEBAR = 32;
let img  , i;
let socket;
let guesserForm = document.getElementById('guesserForm');


function setup(){
  
  // javascript working space
  let canv = createCanvas(400,400);
  canv.center();
  socket = io.connect();
  background(51);
  noStroke();
}

function draw()  {
  // The Imported image background
  image(img, 45, 60, 40, 40);
  
  
  // Background for the web page.
  if(mouseIsPressed){
    stroke('white');
    strokeWeight(20);
    line(mouseX,mouseY,pmouseX,pmouseY);
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

//Listen for guesses

guesserForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  
  let msg = e.target.elements.msg.value;
  
  socket.emit('guess',msg);
});