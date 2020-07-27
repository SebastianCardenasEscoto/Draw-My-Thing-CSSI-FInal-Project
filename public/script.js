/*createCanvas, io.connect, background, ellipse,*/

let socket;
// let pScore;

function setup(){
  let cnv = createCanvas(400,400);
  cnv.center();
  socket = io.connect('http://localhost:3000');
  background(51);
  noStroke();
}

function draw(){
  // Background for the web page.
  if(mouseIsPressed){
    line(mouseX,mouseY,pmouseX,pmouseY);
  }
  
}


// pScore = function() {

//};