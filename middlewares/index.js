const User = require("../models/User");
const helper = require("../helpers");

const setUserCredentials = (req, res, next) => {
	const payload = helper.decodeJwt(req.session && req.session.accessToken);
	if (payload) {
		res.locals.isSupervisor = payload.is_admin;
		res.locals.userId = payload.sub;
		User.findById(payload.sub, (err, currentUser) => {
			if(err) {
				return next(err);
			}
			res.locals.isLoggedIn = !!currentUser;
			res.locals.user = currentUser;
			return next();
		});
	} else {
		res.locals.isLoggedIn = !!payload;
		req.session = null;
		return next();
	}
};

const loggedIn = (req, res, next) => {
	const { isLoggedIn } = res.locals;

	if (isLoggedIn) {
		return next();
	}
	req.session = null;
	req.flash("danger", "You must be logged In");
	res.redirect("/login");
};

const loggedOut = (req, res, next) => {
	const { isLoggedIn } = res.locals;
	if (!isLoggedIn) {
		return next();
	}
	req.flash("danger", "Logged out first");
	res.redirect("/");
};

const notFoundHandler = (req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
};

const errorHandler = (err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
};

module.exports.setUserCredentials = setUserCredentials;
module.exports.loggedIn = loggedIn;
module.exports.loggedOut = loggedOut;
module.exports.notFoundHandler = notFoundHandler;
module.exports.errorHandler = errorHandler;