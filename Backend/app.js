const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');

const notesRoutes = require("./routes/notes");
const userRoutes = require("./routes/user");

const Note = require('./models/note');
const { resolveForwardRef } = require('@angular/core');

const app = express();

mongoose.connect('mongodb+srv://jure:4qOE07hzO905Mofx@cluster0.ui0is.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to database!")
  })
  .catch(() => {
    console.log("Connection failed!")
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", notesRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
