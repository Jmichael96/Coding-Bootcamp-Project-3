// // Loading evnironmental variables here
// if (process.env.NODE_ENV !== 'production') {
// 	console.log('loading dev environments')
// 	require('dotenv').config()
// };
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const dbConnection = require('./db') // loads our connection to the mongo database
const passport = require('./passport')
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const logger = require("morgan");
app.use(logger("dev"));
// ===== Middleware ====
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());
app.use(
	session({
		secret: process.env.APP_SECRET || 'this is the default passphrase',
    store: new MongoStore({ mongooseConnection: dbConnection, 
    useNewUrlParser: true}),
		resave: false,
		saveUninitialized: false
	})
);
// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/project-3",
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);
// ===== Passport ====
app.use(passport.initialize());
app.use(passport.session());
// calling in api routes
app.use("/api", require("./routes")); 
  
// ====== Error handler ====
app.use(function(err, req, res, next) {
	console.log('====== ERROR =======')
	console.error(err.stack)
	res.status(500)
});

// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// // ==== if its production environment!
// if (process.env.NODE_ENV === 'production') {
// 	const path = require('path')
// 	console.log('YOU ARE IN THE PRODUCTION ENV')
// 	app.use('/static', express.static(path.join(__dirname, '../build/static')))
// 	app.get('/', (req, res) => {
// 		res.sendFile(path.join(__dirname, '../build/'))
// 	})
// };