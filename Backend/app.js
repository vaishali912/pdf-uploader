require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const session = require('express-session');
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true
}));
app.use(express.json());
const MongoStore = require('connect-mongo');

const connectDB = require('./db');
connectDB();

const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/', require('./Routes/Login'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));
app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});
