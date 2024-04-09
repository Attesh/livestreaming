const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
app.use(express.static('public'));
// const webrtc = require("wrtc");
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let senderStream;

app.get('/room/:roomId', (req, res) => {
    res.sendFile(`${__dirname}/public/start.html`);
});





var userConnection = [];

io.on('connection', (socket) => {
  console.log('A user connected' +socket.id);


socket.on('users_info_to_signal_server',function(data){
console.log(data.current_user_name);
  var other_users= userConnection.filter(p =>p.meeting_id == data.meeting_id);
  userConnection.push({
    connectionId:socket.id,
    user_id:data.current_user_name,
    meeting_id:data.meeting_id
  });
  console.log(`all users ${userConnection.map(a => a.connectionId)}`);
  console.log(`other users ${other_users.map(a => a.connectionId)}`);


  other_users.forEach(v =>{
    socket.to(v.connectionId).emit('other_users_to_inform',{
      other_user_id:data.current_user_name,
      connId:socket.id
    });
  });

  socket.emit("newconnectioninform",other_users);




})

socket.on('sdpProcess',(data) =>{
  socket.to(data.to_connid).emit('sdpProcess',{
    message:data.message,
    from_connid:socket.id
  })
})

  
});



// Start the server
server.listen(5000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 5000);
});


