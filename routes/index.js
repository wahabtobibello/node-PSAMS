var express = require("express");
const { body, validationResult } = require("express-validator/check");
var jwt = require("jsonwebtoken");

var Student = require("../models/Student");
var Supervisor = require("../models/Supervisor");
var middleware = require("../middlewares");
var sendErrorMessage = require("../helpers").sendErrorMessage;

var router = express.Router();

router.get("/", middleware.loggedIn, function (req, res) {
	res.render("index");
});

router
	.route("/login")
	.get(middleware.loggedOut, function (req, res) {
		res.render("login", { csrfToken: req.csrfToken() });
	})
	.post(
		[
			body("matricNumber")
				.exists(),
			body("password")
				.exists(),
			body("*")
				.not()
				.isEmpty()
		],
		function (req, res, next) {
			var { matricNumber, password } = req.body;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var errorObjs = errors.array();
				console.log(errorObjs);
				const errorMsg = errorObjs[0].msg;
				sendErrorMessage(req, res, "login", errorMsg, { csrfToken: req.csrfToken() });
				return;
			}

			Student
				.findOne({ matricNumber })
				.exec()
				.then(function (student) {
					if (!student) {
						sendErrorMessage(req, res, "login", "User not found", { csrfToken: req.csrfToken() });
						return;
					}
					student
						.verifyPassword(password)
						.then(function (valid) {
							if (!valid) {
								sendErrorMessage(req, res, "login", "Username and Password Mismatch", { csrfToken: req.csrfToken() });
								return;
							}
							var token = jwt.sign({
								exp: Math.floor(Date.now() / 1000) + 3600,
								nbf: Math.floor(Date.now() / 1000),
								iss: req.baseUrl,
								sub: student._id,
								iat: Math.floor(Date.now() / 1000),
								is_admin: student.role === "Supervisor"
							}, process.env.SECRET_KEY);
							req.session.accessToken = token;
							res.redirect("/");
						})
						.catch(function (err) {
							next(err);
						});
				})
				.catch(function (err) {
					next(err);
				});
		});

router
	.route("/register")
	.get(middleware.loggedOut, function (req, res) {
		res.render("register", { csrfToken: req.csrfToken() });
	})
	.post(
		[
			body("firstName")
				.exists(),
			body("lastName")
				.exists(),
			body("password")
				.exists(),
			body("confirmPassword")
				.exists()
				.custom(function (value, { req }) {
					return value === req.body.password;
				})
				.withMessage("Passwords do not match"),
			body("matricNumber")
				.exists()
				.custom(function (matricNumber) {
					return Student
						.findOne({ matricNumber })
						.exec()
						.then(function (student) {
							if (student) {
								throw new Error("User Already Exists");
							} else {
								return true;
							}
						});
				}),
			body("*")
				.not()
				.isEmpty(),
		],
		function (req, res, next) {
			var { firstName, lastName, matricNumber, password, } = req.body;

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var errorObjs = errors.array();
				const errorMsg = errorObjs[0].msg;
				sendErrorMessage(req, res, "register", errorMsg, { firstName, lastName, matricNumber, csrfToken: req.csrfToken() });
				return;
			}

			var newStudentRegistration = new Student({
				name: {
					first: firstName,
					last: lastName
				},
				password,
				matricNumber
			});
			Supervisor.findOne({
				staffNumber: 123456789
			}).exec(function (err, supervisor) {
				if (err) return next(err);
				newStudentRegistration.supervisor = supervisor;
				newStudentRegistration.save(function (err) {
					if (err) {
						return next(err);
					}
					req.flash("info", "You can now log in");
					res.redirect("/login");
				});
			});
		});

router.get("/logout", function (req, res) {
	req.session = null;
	res.redirect("/");
});

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
