// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const socket = require('socket.io');
let users = [];

// our default array of dreams

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

var io = socket(listener);

// runs when new user connects
io.sockets.on('connection', (socket) =>{
  users.push(socket.id);
  
  socket.on("guess", msg => console.log(msg));
  
  socket.on("mouse", (mousePosition)=>{ 
    console.log(mousePosition);
    socket.broadcast.emit("mouse", mousePosition);
  });
});

// runs when user disconnects
io.sockets.on('disconnect', ()=>{
  
});


function userLeave(id){
  let index = users.findIndex(user => user === id);
  
  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

class Player{
  constructor(){
    
  }
}