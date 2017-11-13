var jwt = require("jsonwebtoken");

function decodeJwt(token, prop = null) {
	try {
		var payload = jwt.verify(token, process.env.SECRET_KEY);
		if (!prop || !payload[prop]) return payload;
		return payload[prop];
	} catch (err) {
		return false;
	}
}

function sendErrorMessage(req, res, page, message, data = null) {
	req.flash("danger", message);
	return res.render(page, data);
}

module.exports.decodeJwt = decodeJwt;
module.exports.sendErrorMessage = sendErrorMessage;
