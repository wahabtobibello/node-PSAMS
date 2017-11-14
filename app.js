var express = require("express");
var path = require("path");
// var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var sassMiddleware = require("node-sass-middleware");
var cookieSession = require("cookie-session");
var flash = require("flash");
var helmet = require("helmet");
var csrf = require("csurf");
require("dotenv").config();

var index = require("./routes/index");
var users = require("./routes/users");
var middleware = require("./middlewares");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, "public"),
	dest: path.join(__dirname, "public"),
	indentedSyntax: false, // true = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieSession({
	name: "access_token",
	keys: [process.env.COOKIE_SECRET],
	maxAge: 60 * 60 * 1000, // 1 hour
	domain: process.env.COOKIE_DOMAIN,
	// secure: true,
	// httpOnly: true
}));
app.use(flash());
app.use(helmet());
app.use(csrf({ cookie: true }));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/psams", { useMongoClient: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	// we're connected!
	console.log("Connected to Database!!");
});

app.use(middleware.setUserCredentials);

app.use("/", index);
app.use("/users", users);

app.use(middleware.notFoundHandler);

app.use(middleware.errorHandler);

module.exports = app;
