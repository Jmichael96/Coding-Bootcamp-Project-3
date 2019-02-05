// // Loading evnironmental variables here
// if (process.env.NODE_ENV !== 'production') {
// 	console.log('loading dev environments')
// 	require('dotenv').config()
// };
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const dbConnection = require('./db') // loads our connection to the mongo database
const passport = require('./passport')
const app = express();
var path = require("path");
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

mongoose.Promise = global.Promise
let MONGO_URL = 'mongodb://<dbuser>:<dbpassword>@ds221435.mlab.com:21435/heroku_mc9w7wpq';
const MONGO_LOCAL_URL = 'mongodb://localhost/project-3';

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI)
	MONGO_URL = process.env.MONGODB_URI
} else {
	mongoose.connect(MONGO_LOCAL_URL) // local mongo url
	MONGO_URL = MONGO_LOCAL_URL
}


const db = mongoose.connection
db.on('error', err => {
	console.log(`There was an error connecting to the database: ${err}`)
})
db.once('open', () => {
	console.log(
		`You have successfully connected to your mongo database: ${MONGO_URL}`
	)
})

app.use(bodyParser.json());
app.use(
	session({
		secret: process.env.APP_SECRET || 'this is the default passphrase',
    // store: new MongoStore({ mongooseConnection: dbConnection}),
		resave: false,
		saveUninitialized: false
	})
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