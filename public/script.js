/*createCanvas, io.connect, background, ellipse,*/

let socket;
// let pScore;

function setup(){
  let cnv = createCanvas(400,400);
  cnv.center();
  socket = io.connect('http://localhost:3000');
}

function draw(){
  // Background for the web page.
  background(51);
  ellipse(mouseX,mouseY,20,20);
}

// pScore = function() {

//};