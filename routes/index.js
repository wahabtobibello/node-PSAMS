const express = require("express");
const { body, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
const middleware = require("../middlewares");
const helper = require("../helpers");

const router = express.Router();

router.route("/")
	.get(middleware.loggedIn, (request, response) => {
	response.render("index");
});

router.route("/login")
	.get(middleware.loggedOut, (request, response) => {
		response.render("login", { csrfToken: request.csrfToken() });
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
	helper.wrapAsyncMiddleware(async (request, response, next) => {
		const result = validationResult(request);
		if (!result.isEmpty()) {
			const errorObjs = result.array();
			const errorMsg = errorObjs[0].msg;
			helper.sendErrorMessage(request, response, "login", errorMsg, { csrfToken: request.csrfToken() });
			return;
		}

		const { matricNumber, password } = request.body;
		const newStudentUser = await Student.findOne({ matricNumber }).exec();
		if (!newStudentUser) {
			helper.sendErrorMessage(request, response, "login", "User not found", { csrfToken: request.csrfToken() });
			return;
		}

		const valid = await newStudentUser.verifyPassword(password);
		if (!valid) {
			helper.sendErrorMessage(request, response, "login", "Username and Password Mismatch", { csrfToken: request.csrfToken() });
			return;
		}

		const token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + 3600,
			nbf: Math.floor(Date.now() / 1000),
			iss: request.baseUrl,
			sub: newStudentUser._id,
			iat: Math.floor(Date.now() / 1000),
			is_admin: newStudentUser.role === "Supervisor"
		}, process.env.SECRET_KEY);
		request.session.accessToken = token;
		response.redirect("/");
	})
	);

router
	.route("/register")
	.get(middleware.loggedOut, (request, response) => {
		response.render("register", { csrfToken: request.csrfToken() });
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
			.custom((value, { request }) => {
				return value === request.body.password;
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
	helper.wrapAsyncMiddleware(async (request, response, next) => {
		const result = validationResult(request);
		if (!result.isEmpty()) {
			const errorObjs = result.array();
			const errorMsg = errorObjs[0].msg;
			helper.sendErrorMessage(request, response, "register", errorMsg, { firstName, lastName, matricNumber, csrfToken: request.csrfToken() });
			return;
		}

		const { firstName, lastName, matricNumber, password, } = request.body;
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
		
		request.flash("info", "You can now log in");
		response.redirect("/login");
	})
	);

router.route("/logout")
	.get((request, response) => {
	request.session = null;
	response.redirect("/");
});

// router.get("/test", (request, response, next) =>{
// const supervisor = new Supervisor({
//   name: {
//     first: "Albert",
//     last: "Einstein"
//   },
//   staffNumber: 123456789,
//   password: "nutella"
// })
// supervisor.save(const (error, sup) =>{
//   if (error) return response.send(error);
//   return response.send(sup);
// });

// console.dir(request)

// Supervisor.findOne({
//   staffNumber: 123456789
// }).exec(const (error, supervisor) =>{
//   if (error) return next(error);
//   response.send(supervisor);
// })

// request.flash('danger', 'hello!');
// response.render("register");
// })

module.exports = router;
