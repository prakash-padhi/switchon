const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const User = require("../models/user");
const Dept = require("../models/department");

const Register = async (data, callback) => {
	const { name, email, department, password } = data;
	try {
		// See if user exists
		let userExists = await User.findOne({ email });
		if (userExists) {
			callback({ errors: [{ msg: "User already exists" }] });
		}
		let deptExists = await Dept.findOne({ deptName: department });
		if (deptExists) await Dept.findOneAndUpdate({ deptName: department }, { $push: { users: { name: name, email: email }} });
		else {
			dept = new Dept({
				deptName: department,
				users: { name: name, email: email }
			});
			await dept.save();
		}
		user = new User({
			name,
			email,
			department,
			password
		});

		// Encrypt password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();

		// SEND RESPONSE
		callback({ successMsg: "Registered successfully. Please login...!" });
	} catch (err) {
		console.log(err.message);
		callback("Server error");
	}
}; 


// // @route POST api/register
// // @desc Register user
// router.post("/",
// 	[
// 		check("name", "Name is required")
// 			.not()
// 			.isEmpty(),
//         check("email", "Please enter a valid email").isEmail(),
//         check("department", "Department is required").exists(),
// 		check(
// 			"password",
// 			"Please enter a password with 6 or more characters"
// 		).isLength({ min: 6 })
// 	],
// 	async (req, res) => {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() });
// 		}
// 		const { name, email, department, password } = req.body;
// 		try {
// 			// See if user exists
// 			let userExists = await User.findOne({ email });
// 			if (userExists) {
// 				return res.status(400).json({ errors: [{ msg: "User already exists" }] });
// 			}
// 			let deptExists = await Dept.findOne({ deptName: department });
// 			if (deptExists) await Dept.findOneAndUpdate({ deptName: department }, { $push: { users: { name: name, email: email }} });
// 			else {
// 				dept = new Dept({
// 					deptName: department,
// 					users: { name: name, email: email }
// 				});
// 				await dept.save();
// 			}
// 			user = new User({
// 				name,
//                 email,
//                 department,
// 				password
// 			});

// 			// Encrypt password
// 			const salt = await bcrypt.genSalt(10);
// 			user.password = await bcrypt.hash(password, salt);
// 			await user.save();

// 			// SEND RESPONSE
// 			res.status(200).json({ successMsg: "Registered successfully. Please login...!" });
// 		} catch (err) {
// 			console.log(err.message);
// 			res.status(500).send("Server error");
// 		}
// 	}
// );

module.exports = Register;