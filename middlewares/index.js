const { validationResult } = require("express-validator/check");
const User = require("../models/User");
const helper = require("../helpers");

const setUserCredentials = (request, response, next) => {
	const payload = helper.decodeJwt(request.session && request.session.accessToken);
	if (payload) {
		response.locals.isSupervisor = payload.is_admin;
		response.locals.userId = payload.sub;
		User.findById(payload.sub, (error, currentUser) => {
			if (error) {
				return next(error);
			}
			response.locals.isLoggedIn = !!currentUser;
			response.locals.user = currentUser;
			return next();
		});
	} else {
		response.locals.isLoggedIn = !!payload;
		return next();
	}
};

const loggedIn = (request, response, next) => {
	const { isLoggedIn } = response.locals;

	if (isLoggedIn) {
		return next();
	}
	request.session = null;
	request.flash("danger", "You must be logged In");
	response.redirect("/login");
};

const loggedOut = (request, response, next) => {
	const { isLoggedIn } = response.locals;
	if (!isLoggedIn) {
		return next();
	}
	request.flash("danger", "Logged out first");
	response.redirect("/");
};

const validationResultHandler = (request, response, next) => {
	const result = validationResult(request);
	if (!result.isEmpty()) {
		const errorObjs = result.array();
		const errorMsg = errorObjs[0].msg;
		const error = new Error(errorMsg);
		return next(error);
	}
	next();
};

const logInErrorHandler = (error, request, response, next) => {
	request.flash("danger", error.message);
	response.locals.csrfToken = request.csrfToken();
	response.status(error.status || 401);
	return response.render("login");
};

const registerErrorHandler = (error, request, response, next) => {
	request.flash("danger", error.message);
	response.locals.body = request.body;
	response.locals.csrfToken = request.csrfToken();
	response.status(error.status || 400);
	return response.render("register");
};

const notFound = (request, response, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
};

const errorHandler = (error, request, response, next) => {
	// set locals, only providing error in development
	response.locals.errorMessage = error.message;
	response.locals.error = request.app.get("env") === "development" ? error : {};

	// render the error page
	response.status(error.status || 500);
	response.render("error");
};

// const sendErrorMessage = (request, response, next) => {
// 	response.locals.body = request.body;
// 	request.flash("danger", message);
// 	return response.render(page, data);
// };

module.exports = {
	setUserCredentials,
	loggedIn,
	loggedOut,
	validationResultHandler,
	logInErrorHandler,
	registerErrorHandler,
	notFound,
	errorHandler
};