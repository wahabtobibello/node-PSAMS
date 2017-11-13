var express = require('express');
var jwt = require('jsonwebtoken');

var Student = require("../models/Student");
var Supervisor = require("../models/Supervisor");
var User = require("../models/User");
var middleware = require("../middlewares");
var sendErrorMessage = require("../helpers").sendErrorMessage;

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router
  .route("/login")
  .get(middleware.loggedOut, function (req, res, next) {
    res.render('login', { csrfToken: req.csrfToken() });
  })
  .post(function (req, res, next) {
    res.send(req.body);
  });

router
  .route("/register")
  .get(function (req, res, next) {
    res.render('register', { csrfToken: req.csrfToken() });
  })
  .post(function (req, res, next) {
    res.send(req.body);
  });
router.get("/logout", function (req, res, next) {
  req.session = null;
  res.redirect("/");
})

// router.get("/test", function (req, res, next) {
// var supervisor = new Supervisor({
//   name: {
//     first: "Albert",
//     last: "Einstein"
//   },
//   staffNumber: 123456789,
//   password: "nutella"
// })
// supervisor.save(function (err, sup) {
//   if (err) return res.send(err);
//   return res.send(sup);
// });

  // console.dir(req)

  // Supervisor.findOne({
  //   staffNumber: 123456789
  // }).exec(function (err, supervisor) {
  //   if (err) return next(err);
  //   res.send(supervisor);
  // })

  // req.flash('danger', 'hello!');
  // res.render("register");
// })

module.exports = router;
