/*createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, createCanvas, background*/

const SPACEBAR = 32;
let img  , i;
let socket;
let x,y,w,h;
let guesserForm = document.getElementbById('guesserForm');

// importimg image
function preload() {
  img = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Fheart.png?v=1595961536085');
}

function setup(){
  
  // javascript working space
  let canv = createCanvas(400,400);
  canv.center();
  socket = io.connect();
  background(51);
  noStroke();
  wx= 30 ;        
  wy = 40;
  ww = 120;
  wh = 110;
 // create a tex box  
textSize(15);
 // text color
fill("white");
// the actual text
text('Waiting for players...', 10, 30);
  
// where the image is going to be placed on the screen
  img.loadPixels();
  i  = img.get(img.width / 2, img.height / 2);
}

function draw()  {
// The created rectangle properties
  fill(13, 115, 105);
  noStroke();
  rect(wx,wy,ww,wh,20);
  
  // The Imported image background
  background(i);
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
  
  let msg = e.target.elemets.msg.value;
  
  socket.emit('guess',msg);
});