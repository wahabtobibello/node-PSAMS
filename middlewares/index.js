function loggedIn(req, res, next) {
  var { isLoggedIn } = res.locals;

  if (isLoggedIn) {
    return next();
  }
    req.session = null;
  req.flash("danger", "You must be logged In");
    res.redirect("/login");
  } 
  res.locals.isAuthenticated = true;
  next();
}


module.exports.requireAuth = requireAuth;