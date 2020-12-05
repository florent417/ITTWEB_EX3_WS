var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const {Server} = require("ws");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const INDEX = 'public/index.html';
const app = express();
require('dotenv').config()

const server = express().use((req, res) => res
  .sendFile(INDEX, { root: __dirname }))
  .listen(3000, "localhost", () => {console.log(`HTTP on 3000`);});

const wsServer = new Server({server});
wsServer.on('connection',
  wsClient =>{
    wsClient.send('This message was pushed to the ws server');

    wsClient.onerror = err => console.log(`The server received error: ${err['code']}`);

    wsClient.onmessage = (message) =>
        console.log(`The server received: ${message['data']}`);
  }
)


setInterval(() => {
  wsServer.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);


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
