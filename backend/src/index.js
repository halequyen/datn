require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const route = require('./routes');
const db = require('./config/db');
const mongoose = require('mongoose');
const app = express();
const port = 3333;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Xử lý kết nối từ client
io.on('connection', (socket) => {
  console.log('Client connected');

  // Xử lý khi có đặt lịch mới
  socket.on('new-schedule', (schedule) => {
    // Phát sự kiện new-schedule tới tất cả các client đã kết nối
    io.emit('new-schedule', schedule);
  });

  // Xử lý khi client ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

route(app);

server.listen(port, () => {
  console.log(`App listening on port http://127.0.0.1:${port}`);
});
