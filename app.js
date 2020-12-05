var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const {Server} = require("ws");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')
const INDEX = 'public/index.html';
const app = express();
const HighScoreService = require("./services/highScoreService")
require('dotenv').config()

const server = express().use((req, res) => res
  .sendFile(INDEX, { root: __dirname }))
  .listen(3000, () => {console.log(`HTTP on 3000`);});



  const wsServer = new Server({server});
wsServer.on('connection',
  wsClient =>{
    HighScoreService.getHighScore().then((value) =>{
      console.log("VALUE: " + value);
      wsServer.clients.forEach((client) => {
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
        wsServer.clients.forEach((client) => {
          client.send(JSON.stringify(value));
        });
      })
      
    }
  }
)


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

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;
