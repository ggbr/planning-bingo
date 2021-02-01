var express = require('express');
var server = require('http').Server(app);
var cors = require('cors');
var app = express();

require('dotenv').config()


app.use(cors({
  origin: process.env.HOST
}));

const io = require('socket.io')(server, {
    cors: {
      origin: process.env.HOST,
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});





let table =  [
  [null,null,null,null,null],
  [null,null,null,null,null],
  [null,null,null,null,null]
];

let persons = [];
let list_admin = []
let result = false;

io.on('connection', (socket) => {

   let updateClientsAdmin = function() {
       console.log('#######################')
       io.emit("updateAdmin", {
            admin: list_admin,
            persons: persons,
            result: result
        });
   };
    
  console.log('a user connected');
  
  socket.on("setResult", (data) => {
    result = data;
    updateClientsAdmin()

  });
  
  socket.on("addAdmin", (admin) => {
      console.log("add admin");
    let addAdmin = (function(){
        for(var i = 0; i < list_admin.length; i++ ){
            if(list_admin[i] == admin){
                list_admin[i] = admin;
              return true;  
            }
        }

        return false;
    })

    if(! addAdmin()){
        list_admin.push(admin);
    }
    updateClientsAdmin()
  });
  
  
  
  
  socket.on("clientSendBingo", (bingo) => {
    console.log(bingo)
    
    let validBingo = (function(){
        for(var i = 0; i < persons.length; i++ ){
            if(persons[i].name == bingo.name){
              persons[i].position = bingo.position;
              return true;  
            }
        }

        return false;
    })

    if(! validBingo()){
        persons.push(bingo);
    }



    console.log(persons);
    console.log(validBingo());
    updateClientsAdmin()


  });
});


console.log(process.env.HOST);

server.listen(process.env.POST, () => {
  console.log('listening on *:'+process.env.POST);
});