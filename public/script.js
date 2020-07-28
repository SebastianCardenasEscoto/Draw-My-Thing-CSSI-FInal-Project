/*createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY*/

const SPACEBAR = 32;
let img;
let socket;
// let pScore;

function preload() {
  img = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Fpaintbrush.png?v=1595894948932');
}

function setup(){
  let canv = createCanvas(400,400);
  canv.center();
  socket = io.connect();
  background(51);
  noStroke();
  // image(img, 200, 200);
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
  constructor(){
    this.color;
    this.mode;
    this.strokeWidth;
  }
}
