let socket;

function setup(){
  createCanvas(200,200);
  
  socket = io.connect('http://localhost:3000');
}

function draw(){
  background(51);
  ellipse(mouseX,mouseY,60,60);
}