require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const bodyParser = require("body-parser");

const route = require('./routes')
const db = require('./config/db')
const mongoose = require('mongoose')
const app = express();
const port = 3333;

db.connect()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


route(app)

app.listen(port, () => {
  console.log(`App listening on port http://127.0.0.1:${port}`);
});