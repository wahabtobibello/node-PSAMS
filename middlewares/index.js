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
    })
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


module.exports.setUserCredentials = setUserCredentials;
module.exports.loggedIn = loggedIn;
module.exports.loggedOut = loggedOut;