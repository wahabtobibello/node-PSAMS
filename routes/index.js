const express = require("express");
const { body, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
const middleware = require("../middlewares");
const sendErrorMessage = require("../helpers").sendErrorMessage;
const asyncMiddleware = require("../helpers").asyncMiddleware;

const router = express.Router();

router.get("/", middleware.loggedIn, (req, res) => {
	res.render("index");
});

router
	.route("/login")
	.get(middleware.loggedOut, (req, res) => {
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
	asyncMiddleware(async (req, res, next) => {
		const { matricNumber, password } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorObjs = errors.array();
			const errorMsg = errorObjs[0].msg;
			sendErrorMessage(req, res, "login", errorMsg, { csrfToken: req.csrfToken() });
			return;
		}

		const newStudentUser = await Student.findOne({ matricNumber }).exec();
		if (!newStudentUser) {
			sendErrorMessage(req, res, "login", "User not found", { csrfToken: req.csrfToken() });
			return;
		}

		const valid = await newStudentUser.verifyPassword(password);
		if (!valid) {
			sendErrorMessage(req, res, "login", "Username and Password Mismatch", { csrfToken: req.csrfToken() });
			return;
		}

		const token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + 3600,
			nbf: Math.floor(Date.now() / 1000),
			iss: req.baseUrl,
			sub: newStudentUser._id,
			iat: Math.floor(Date.now() / 1000),
			is_admin: newStudentUser.role === "Supervisor"
		}, process.env.SECRET_KEY);
		req.session.accessToken = token;
		res.redirect("/");
	})
	);

router
	.route("/register")
	.get(middleware.loggedOut, (req, res) => {
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
			.custom((value, { req }) => {
				return value === req.body.password;
			})
			.withMessage("Passwords do not match"),
		body("matricNumber")
			.exists()
			.custom((matricNumber) => {
				return Student
					.findOne({ matricNumber })
					.exec()
					.then((student) => {
						if (student) {
							throw new Error("User Already Exists");
						} else {
							return true;
						}
					});
			}),
		body("*")
			.not()
			.isEmpty()
	],
	asyncMiddleware(async (req, res, next) => {
		const { firstName, lastName, matricNumber, password, } = req.body;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorObjs = errors.array();
			const errorMsg = errorObjs[0].msg;
			sendErrorMessage(req, res, "register", errorMsg, { firstName, lastName, matricNumber, csrfToken: req.csrfToken() });
			return;
		}

		const newStudentRegistration = new Student({
			name: {
				first: firstName,
				last: lastName
			},
			password,
			matricNumber
		});
		const assignedSupervisor = await Supervisor.findOne({ staffNumber: 123456789 }).exec();
		newStudentRegistration.supervisor = assignedSupervisor;
		
		const savedData = await newStudentRegistration.save();
		
		req.flash("info", "You can now log in");
		res.redirect("/login");
	})
	);

router.get("/logout", (req, res) => {
	req.session = null;
	res.redirect("/");
});

// router.get("/test", (req, res, next) =>{
// const supervisor = new Supervisor({
//   name: {
//     first: "Albert",
//     last: "Einstein"
//   },
//   staffNumber: 123456789,
//   password: "nutella"
// })
// supervisor.save(const (err, sup) =>{
//   if (err) return res.send(err);
//   return res.send(sup);
// });

// console.dir(req)

// Supervisor.findOne({
//   staffNumber: 123456789
// }).exec(const (err, supervisor) =>{
//   if (err) return next(err);
//   res.send(supervisor);
// })

// req.flash('danger', 'hello!');
// res.render("register");
// })

module.exports = router;
