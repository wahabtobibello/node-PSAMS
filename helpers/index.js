function decodeJwt(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}
function isAuthenticated(req) {
  if (req.session && req.session.accessToken) {
    var token = req.session.accessToken;
    try {
      decodeJwt(req.session.accessToken);
      return true;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
}
function sendErrorMessage(req, res, page, message, data = null) {
  req.flash("danger", message);
  res.render(page, { data });
}

module.exports.decodeJwt = decodeJwt;
module.exports.isAuthenticated = isAuthenticated;
module.exports.sendErrorMessage = sendErrorMessage;
