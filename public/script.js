/*createCanvas, io.connect, background, ellipse,*/

let socket;

function setup(){
  let cnv = createCanvas(400,400);
  cnv.center()
  socket = io.connect('http://localhost:3000');
}

function draw(){
  background(51);
  ellipse(mouseX,mouseY,60,60);
}

// function 