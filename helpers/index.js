const jwt = require("jsonwebtoken");

const decodeJwt = (token, prop = null) => {
	try {
		const payload = jwt.verify(token, process.env.SECRET_KEY);
		if (!prop || !payload[prop]) return payload;
		return payload[prop];
	} catch (err) {
		return false;
	}
};

const asyncMiddleware = fn => (
	req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

const sendErrorMessage = (req, res, page, message, data = null) => {
	req.flash("danger", message);
	return res.render(page, data);
};

module.exports.decodeJwt = decodeJwt;
module.exports.sendErrorMessage = sendErrorMessage;
module.exports.asyncMiddleware = asyncMiddleware;
