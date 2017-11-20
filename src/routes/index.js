const express = require("express");
const { body } = require("express-validator/check");
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
		response.locals.csrfToken = request.csrfToken && request.csrfToken() || "";
		response.render("login");
	})
	.post(
	[
		body("matricNumber")
			.exists(),
		body("password")
			.exists(),
		body("*")
			.not()
			.isEmpty(),
		middleware.validationResultHandler
	],
	helper.wrapAsyncMiddleware(async (request, response, next) => {

		const { matricNumber, password } = request.body;
		const newStudentUser = await Student.findOne({ matricNumber }).exec();
		if (!newStudentUser) {
			const error = new Error("User not found");
			return next(error);
		}

		const valid = await newStudentUser.verifyPassword(password);
		if (!valid) {
			const error = new Error("Username and Password Mismatch");
			return next(error);
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

router.route("/register")
	.get(middleware.loggedOut, (request, response) => {
		response.locals.csrfToken = request.csrfToken && request.csrfToken() || "";
		response.render("register");
	})
	.post(
	[
		body("firstName").exists().withMessage("First name not specified"),
		body("lastName").exists().withMessage("Last name not specified"),
		body("password").exists().withMessage("Password not specified"),
		body("confirmPassword").exists()
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
			}).withMessage("Matric Number not specified"),
		body("*")
			.not()
			.isEmpty(),
		middleware.validationResultHandler
	],
	helper.wrapAsyncMiddleware(async (request, response, next) => {

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

router.use("/login", middleware.logInErrorHandler);
router.use("/register", middleware.registerErrorHandler);

module.exports = router;
