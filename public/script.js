/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker, fill, Qs, erase,noErase, rect, CONTROL, SPACEBAR, width, height, color,createInput*/

const SPACEBAR = 32;

const userName = Qs.parse(location.search,{
   ignoreQueryPrefix: true
 });

let backgroundColor = 51;
let drawingForm = document.getElementById("sketch-div");
let guessForm = document.getElementById("guessForm");

let colorPicker, paintbrush, socket, canv, isPlayerActive, gameStart, previousBackground, Interactivefield, output;
let img, img2;
let r , c;
socket = io.connect();

 function preload() {
   // preload() runs once
   // img = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Frect00.png?v=1596119775652');
   // img2 = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Fcircle-xxl.png?v=1596119912434')
 }

function setup(){
  // Interactivefield = createInput();
  // Interactivefield.changed(newText);
  // Interactivefield.changed(newTyping);
  // output = select('#output');
  
  // img.loadPixels();
  // r = img.get(img.width / 2, img.height / 2);
  // c = img2.get(img2.width / 2, img2.height / 2);
  
  // javascript working space
  canv = createCanvas(400,400);
  canv.parent('sketch-div');
  
  socket.on("clearCanv", ()=>{
     resetCanv();
  });
  
  socket.on("gameStarted", ()=>{
   switchText();
   gameStart= true;
  });
  
  socket.on("redirect", ()=> switchText());
  
  socket.on("active", (activity) => isPlayerActive = activity);
  
  socket.on("backgroundColor", (apBackgroundColor) => {
    console.log(apBackgroundColor);
    let bolor = color(apBackgroundColor._array[0]*255,apBackgroundColor._array[1]*255,apBackgroundColor._array[2]*255,apBackgroundColor._array[3]*255);
    updateBackground(bolor); 
  });
  
  socket.on("guess", )
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
  switchText();
  if(isPlayerActive){
    if(  JSON.stringify(backgroundColor) != JSON.stringify(colorPicker.color() ) ){
      updateBackground();
      socket.emit("backgroundColor",backgroundColor);
      
      colorPickerVisibility(true);
      guessForm.style.visibility = "hidden";
    } 
  } else{
    colorPickerVisibility(false);
    guessForm.style.visibility = "visible";
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

function switchText()  {
  let topText = document.getElementById('top-text');
  if(isPlayerActive == true){
      topText.innerHTML = "You are the Drawer";
    } else{
      topText.innerHTML = "You are the Guesser";
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
    console.log(bgc);
    backgroundColor = bgc;
    drawingForm.style.backgroundColor = backgroundColor;
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

function newTyping()  {
  // output.html(#ifield.value());
  
  

}



function newText()  {
  
}

function colorPickerVisibility(bool){
  if(bool){
    document.getElementById("color-picker").style.visibility = "visible"
    colorPicker.style("visibility:visible");
  } else if(gameStart == true){
    document.getElementById("color-picker").style.visibility = "hidden"
    colorPicker.style("visibility:hidden");
  }
}