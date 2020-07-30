/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker, fill, Qs, erase,noErase, rect, CONTROL, SPACEBAR, width, height, color*/

const SPACEBAR = 32;

const userName = Qs.parse(location.search,{
   ignoreQueryPrefix: true
 });

let backgroundColor = 51;
let drawingForm = document.getElementById("sketch-div");
let guessForm = document.getElementById("guessForm");

let colorPicker, paintbrush, socket, canv, isPlayerActive, gameStart, previousBackground;
let img, img2;
let r , c;
socket = io.connect();

 function preload() {
   // preload() runs once
   img = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Frect00.png?v=1596119775652');
   img2 = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Fcircle-xxl.png?v=1596119912434')
 }

function setup(){
  
  img.loadPixels();
  r = img.get(img.width / 2, img.height / 2);
  c = img2.get(img2.width / 2, img2.height / 2);
  
  // javascript working space
  canv = createCanvas(400,400);
  canv.parent('sketch-div');
  
  socket.on("clearCanv", ()=>{
     resetCanv();
  });
  
  socket.on("gameStarted", ()=>{
   switchUserPage();
   gameStart= true;
  });
  
  socket.on("redirect", ()=> switchUserPage());
  
  socket.on("active", (activity) => isPlayerActive = activity);
  
  socket.on("backgroundColor", (apBackgroundColor) => {
   updateBackground(apBackgroundColor); 
  });
  

  paintbrush = new PaintBrush;
  
  socket.emit('playerJoin',userName);
  noStroke();
  colorPicker = createColorPicker('#ed225d');
  colorPicker.parent("color-picker");
  
  socket.on("mouse", (drawerData) => {
      let drawerBrush = new PaintBrush;
      Object.assign(drawerBrush,drawerData);
      drawerBrush.draw();
     });
 
  }

function draw()  {

  // image(img, 7,8,41,20);
  // image(img2,60,10,20,20);
  
  // This fucntion allows the background to change to whatever color is selected.\
  if(isPlayerActive){
    if(  JSON.stringify(backgroundColor) != JSON.stringify(colorPicker.color() ) ){
      updateBackground();
      socket.emit("backgroundColor",backgroundColor);  
    }
  }

  
  
  if(mouseIsPressed && mouseInCanvas()){
    
    let mousePosition = {
      x: mouseX,
      y: mouseY,
      pX: pmouseX,
      pY: pmouseY
    };
    
    if(isPlayerActive){
    
    paintbrush.draw();
    paintbrush.position = mousePosition;
    socket.emit("mouse", paintbrush);
    paintbrush.position = null;
    }
  }
  
  
}
// whenever the spacebar key is pressed the screen changes the background color     
function keyPressed(){
  if(keyCode == SPACEBAR){
    if(isPlayerActive){
      resetCanv();
      socket.emit("clearCanv");
    }
  } else if (keyCode == CONTROL){
    paintbrush.isErasing = !paintbrush.isErasing;
  }
  
  
}

// it might be useful to make one of these 
class PaintBrush{
  constructor(){
    this.color = "white";
    this.mode = "LINE";
    this.isErasing = false;
    this.strokeWeight = 10;
    this.squarePoints = null;
    
    this.position;
  }
  
  draw(){
    stroke(this.color);
    fill(this.color);
    strokeWeight(this.strokeWeight);
    
    this.isErasing? erase(): noErase();
    
    if(this.mode == "LINE"){
      this.drawLine();
    } else if(this.mode == "RECT"){
      this.drawRect();
    }
  }
  
  drawLine(){
    if(this.position == null){
    line(mouseX,mouseY,pmouseX,pmouseY);
    } else{
      line(this.position.x,this.position.y,this.position.pX,this.position.pY);
    }
  }
  
  drawRect(){
    if(this.squarePoints === null){ 
      this.squarePoints = {
            x: mouseX,
            y: mouseY
        };
      console.log(this.squarePoints);
    } else{
      console.log(this.squarePoints);
      rect(this.squarePoints.x, this.squarePoints.y, this.sqaurePoints.x - mouseX);
    } 
  }
}

guessForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  
  socket.emit('guess', msg);
  
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function switchUserPage()  {
  if(isPlayerActive == true){
    window.location.replace("drawer.html")
    } else if(gameStart){
    window.location.replace("guesser.html")
    }
}

function resetCanv(){
   canv = createCanvas(400,400);
    canv.parent("sketch-div");
}

function updateBackground(bgc){
  if(bgc == null){
    backgroundColor = colorPicker.color();
    drawingForm.style.backgroundColor = backgroundColor;
  } else{
    backgroundColor = bgc;
    drawingForm.style.backgroundColor = backgroundColor.toString();
  }
}

function mouseInCanvas(){
  if(mouseX < 0) 
    return false;
  else if(mouseX > width) 
    return false; 
  else if(mouseY < 0)
    return false;
  else if(mouseY > height)
    return false;
  else
    return true;
}
