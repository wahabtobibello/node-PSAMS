var jwt = require('jsonwebtoken');

var isAuthenticated = require("../helpers").isAuthenticated;

function requireAuth(req, res, next) {
  
  if (!isAuthenticated(req)) {
    res.locals.isAuthenticated = false;
    req.session = null;
    req.flash("danger", "You must be logged In")
    res.redirect("/login");
  } 
  res.locals.isAuthenticated = true;
  next();
}


module.exports.requireAuth = requireAuth;