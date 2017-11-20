const jwt = require("jsonwebtoken");

const daysOfTheWeek =["sunday",
											"monday",
											"tuesday",
											"wednesday",
											"thursday",
											"friday",
											"saturday"];

const decodeJwt = (token, prop = null) => {
	try {
		const payload = jwt.verify(token, process.env.SECRET_KEY);
		if (!prop || !payload[prop]) return payload;
		return payload[prop];
	} catch (error) {
		return false;
	}
};

const wrapAsyncMiddleware = fn =>
	(request, response, next) =>
		Promise.resolve(fn(request, response, next)).catch(next);

const sendErrorMessage = (request, response, page, message, data = null) => {
	request.flash("danger", message);
	return response.render(page, data);
};

module.exports = {
	daysOfTheWeek,
	decodeJwt,
	sendErrorMessage,
	wrapAsyncMiddleware
};