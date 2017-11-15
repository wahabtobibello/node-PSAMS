const express = require("express");
const path = require("path");
// const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sassMiddleware = require("node-sass-middleware");
const cookieSession = require("cookie-session");
const flash = require("flash");
const helmet = require("helmet");
const csrf = require("csurf");
require("dotenv").config();

const index = require("./routes/index");
const users = require("./routes/users");
const middleware = require("./middlewares");

const app = express();

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

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/psams", { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	// we're connected!
	console.log("Connected to Database!!");
});

app.use(middleware.setUserCredentials);

app.use("/", index);
app.use("/users", users);

app.use(middleware.notFound);

app.use(middleware.errorHandler);

module.exports = app;
