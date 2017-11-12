var express = require('express');
var jwt = require('jsonwebtoken');

var Student = require("../models/Student");
var Supervisor = require("../models/Supervisor");
var mid = require("../middlewares");
var sendErrorMessage = require("../helpers").sendErrorMessage;

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router
  .route("/login")
  .get(function (req, res, next) {
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
  res.redirect("/login");

})
router.get("/test", function (req, res, next) {
  // console.dir(req)

  // Supervisor.findOne({
  //   staffNumber: 123456789
  // }).exec(function (err, supervisor) {
  //   if (err) return next(err);
  //   res.send(supervisor);
  // })

  // req.flash('danger', 'hello!');
  // res.render("register");
})

module.exports = router;
