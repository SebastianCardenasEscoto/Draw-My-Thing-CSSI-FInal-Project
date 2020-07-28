/*createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY*/

const SPACEBAR = 32;
let img;
let socket;
// let pScore;

function setup(){
  let cnv = createCanvas(400,400);
  cnv.center();
  socket = io.connect();
  background(51);
  noStroke();
  image(img, 0, 0);
}

function draw(){
  // Background for the web page.
  if(mouseIsPressed){
    stroke('white');
    strokeWeight(20);
    line(mouseX,mouseY,pmouseX,pmouseY);
  }
  
}

function keyPressed(){
  if(keyCode == SPACEBAR){
    background(51);
  }
  
  
}

// it might be useful to make one of these 
class PaintBrush{
  
}

