var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router
  .route("/login")
  .get(function (req, res, next) {
    res.render('login');
  })
  .post(function (req, res, next) {
    res.send(req.body);
  });

router
  .route("/register")
  .get(function (req, res, next) {
    res.render('register');
  })
  .post(function (req, res, next) {
    res.send(req.body);
  });

module.exports = router;
