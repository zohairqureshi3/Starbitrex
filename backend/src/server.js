require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const path = require("path");
const routes = require('./routes/index');

let PORT = process.env.PORT;

// == 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '../upload')))

app.use('/api', routes);

// Admin Site Build Path
app.use('/admin/', express.static(path.join(__dirname, '../admin/build')))
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../admin/build', 'index.html'));
});

// Front Site Build Path
app.use('/', express.static(path.join(__dirname, '../client/build')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//== 2 - SET UP DATABASE
//Configure mongoose's promise to global promise

mongoose.promise = global.Promise;

mongoose.connect(process.env.MONGO_LOCAL_CONN_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(passport.initialize());
require("./middlewares/jwt")(passport);

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
