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


module.exports.loggedIn = loggedIn;
module.exports.loggedOut = loggedOut;