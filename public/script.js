/*global createCanvas, io.connect, background, ellipse, mouseX, mouseY, line, pmouseX, pmouseY, io, noStroke, keyCode,
mouseIsPressed, stroke, strokeWeight, createColorPicker, fill, Qs, erase,noErase, rect, CONTROL, SPACEBAR, width, height, color,createInput
colorMode, RGB*/

const SPACEBAR = 32;

const userName = Qs.parse(location.search,{
   ignoreQueryPrefix: true
 });

let backgroundColor = 51;
let drawingForm = document.getElementById("sketch-div");
let guessForm = document.getElementById("guessForm");
let chatMessages = document.getElementById("chat");

let colorPicker, paintbrush, socket, canv, isPlayerActive, 
    gameStart, previousBackground, Interactivefield, output,
    paintbrushColorPicker;

let img, img2;
let r , c;
socket = io.connect();

 function preload() {
   // preload() runs once
   // img = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Frect00.png?v=1596119775652');
   // img2 = loadImage('https://cdn.glitch.com/788491d6-3d68-4b92-871c-448f512a6761%2Fcircle-xxl.png?v=1596119912434')
 }

function setup(){
  // javascript working space
  canv = createCanvas(400,400);
  canv.parent('sketch-div');
  
  // THis line reset the canvas through socket.io
  socket.on("clearCanv", ()=>{
     resetCanv();
  });
  // This line execute the gameStarted function 
  // This lines of codes pretty much explain it self
  socket.on("gameStarted", ()=>{
   gameStart = true;
   switchText();
  });
  
  socket.on("guesser", ()=> {
    updateGuesserText();
  });
  
  socket.on("activeWord", activeWord => displayWord(activeWord));
  
  socket.on("active", (activity) => {
   isPlayerActive = activity;
   
  });
  
  socket.on("mouse", (drawerData) => {
      let drawerBrush = new PaintBrush;
      Object.assign(drawerBrush,drawerData);
      drawerBrush.draw();
     });
 
  socket.on("backgroundColor", (apBackgroundColor) => {
    console.log(apBackgroundColor);
    let bolor = color(apBackgroundColor._array[0]*255,apBackgroundColor._array[1]*255,apBackgroundColor._array[2]*255,apBackgroundColor._array[3]*255);
    updateBackground(bolor); 
  });
  
  socket.on("guess", (guess) =>{
    outputMessage(guess);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
  // new paintbrush function
  paintbrush = new PaintBrush;
  
  socket.emit('playerJoin',userName);
  
  socket.on('playerJoin',(player) => outputPlayer(player));
  
  noStroke();
  
  colorPicker = createColorPicker('#ed225d');
  colorPicker.parent("background-color-picker");
  
  paintbrushColorPicker = createColorPicker('#fff');
  paintbrushColorPicker.parent("paintbrush-color-picker");
  
  }

function draw()  { 
  // This fucntion allows the background to change to whatever color is selected.\
  switchText();
  if(isPlayerActive){
    
    // paintbrush.color = paintbrushColorPicker.color();
    if(  JSON.stringify(backgroundColor) != JSON.stringify(colorPicker.color() ) ){
      updateBackground();
      socket.emit("backgroundColor",backgroundColor);
      // 
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
  if(!gameStart){
    
  }else{
    if(isPlayerActive == true){
        topText.innerHTML = "You are the Drawer";
      } else if(isPlayerActive == false) {
        topText.innerHTML = "You are the Guesser";
      }
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


function colorPickerVisibility(bool){
    let colorpickers = document.getElementById("color-pickers").children;
    colorpickers = Array.from(colorpickers);
      
  if(bool){
    colorpickers.forEach(colorpicker => colorpicker.style.visibility = "visible");
    colorPicker.style("visibility:visible");
    paintbrushColorPicker.style("visibility:visible");
    
  } else if(gameStart == true){
    colorpickers.forEach(colorpicker => colorpicker.style.visibility = "hidden");
    colorPicker.style("visibility:hidden");
    paintbrushColorPicker.style("visibility:hidden");
  }
}

function outputMessage(msg){
  let div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${msg.username} <span>${msg.time}</span></p>
						  <p class="text">
                  ${msg.text}
						  </p>`;
  chatMessages.appendChild(div);
}

function outputPlayer(msg){
  let div = document.createElement('div');
  div.classList.add('message'); div.classList.add('small-message');
  div.innerHTML = `<p class ="meta"> ${msg.username}: ${msg.score} points</p>`;
  document.getElementById('player-box').appendChild(div);
}

function displayWord(word){
  let div = document.createElement('h1');
  
  document.getElementById('top-text-container').innerHTML = "";
  div.innerHTML = `Your word is: ${word}`;
  document.getElementById('top-text-container').appendChild(div);
  document.getElementById('top-text').innerHTML = "You are the Drawer!";
}

function updateGuesserText(){
  document.getElementById('top-text-container').innerHTML = "<h1> You are the Guesser </h1>"
}