var User = require("../models/User");
var helper = require("../helpers");

function setUserCredentials(req, res, next) {
	var payload = helper.decodeJwt(req.session && req.session.accessToken);
	if (payload) {
		res.locals.isLoggedIn = !!payload;
		res.locals.isSupervisor = payload.is_admin;
		res.locals.userId = payload.sub;
		User.findById(payload.sub, function (err, currentUser) {
			if (err) {
				return next(err);
			}
			res.locals.user = currentUser;
			return next();
		});
	} else {
		res.locals.isLoggedIn = !!payload;
		return next();
	}
}

function loggedIn(req, res, next) {
	var { isLoggedIn } = res.locals;

	if (isLoggedIn) {
		return next();
	}
	req.session = null;
	req.flash("danger", "You must be logged In");
	res.redirect("/login");
}

function loggedOut(req, res, next) {
	var { isLoggedIn } = res.locals;
	if (!isLoggedIn) {
		return next();
	}
	req.flash("danger", "Logged out first");
	res.redirect("/");
}

function notFoundHandler(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
}

function errorHandler(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
}

module.exports.setUserCredentials = setUserCredentials;
module.exports.loggedIn = loggedIn;
module.exports.loggedOut = loggedOut;
module.exports.notFoundHandler = notFoundHandler;
module.exports.errorHandler = errorHandler;