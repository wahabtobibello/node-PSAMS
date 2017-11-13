var jwt = require('jsonwebtoken');
var User = require("../models/User");

function decodeJwt(token, prop = null) {
  var payload = jwt.verify(token, process.env.SECRET_KEY);
  if (prop === null) return payload;
  return payload[prop];
}

function getUserCredentials(req) {
  try {
    var payload = decodeJwt(req.session && req.session.accessToken);
    return {
      isLoggedIn: true,
      isSupervisor: payload.is_admin,
      userId: payload.sub
    };
  } catch (err) {
    return {
      isLoggedIn: false
    };
  }
}
function sendErrorMessage(req, res, page, message, data = null) {
  req.flash("danger", message);
  return res.render(page, data);
}

module.exports.getUserCredentials = getUserCredentials;
module.exports.sendErrorMessage = sendErrorMessage;
