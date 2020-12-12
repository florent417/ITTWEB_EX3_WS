var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')
const INDEX = 'public/index.html';
const HighScoreService = require("./services/highScoreService")
const socketIo = require('socket.io');
const http = require('http')

require('dotenv').config()

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/users', usersRouter);


const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
})


/*
io.on('connection',
  wsClient =>{
    HighScoreService.getHighScore().then((value) =>{
      console.log("VALUE: " + value);
      io.clients.forEach((client) => {
        client.send(JSON.stringify(value));
      });
    })

    wsClient.onerror = err => console.log(`The server received error: ${err['code']}`);

    wsClient.onmessage = async (message) => {
      console.log(`The server received: ${message['data']}`);
      var json = message['data']
      var obj = JSON.parse(json);
      console.log(obj);
      await HighScoreService.createHighScore(obj);
      HighScoreService.getHighScore().then((value) =>{
        console.log("VALUE: " + value);
        io.clients.forEach((client) => {
          client.send(JSON.stringify(value));
        });
      })
      
    }
  }
)
*/

io.on("connection", async (socket) => {
  console.log("New client connected");

  console.log('init')


  HighScoreService.getHighScore().then((value) =>{
    socket.emit('Initialhighscore', value)})


  socket.on("newhighscore", function(data) {
    console.log('Recieved new highscore')
    HighScoreService.createHighScore(data)
    socket.emit("newhighscore", data)
  })

  

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

async function getInitalHighScore(){
  await HighScoreService.getHighScore().then(async (value) => {
    console.log('qwdqwdqw')
    console.log(value)
    return await value
  })
}

let dbURI = "mongodb://localhost/Gr14DualNBack";
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false 
});

// TODO: Remove, test purposes
mongoose.connection.on("connected", () => {
    console.log(mongoose.connection.name);
});





server.listen(PORT, () => console.log(PORT));