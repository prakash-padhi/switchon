const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const config = require("config");

const User = require("../models/user");

const Login = async (data, callback) => {
	const { email, password } = data;
	try {
		// Check if user exists
		let user = await User.findOne({ email });
		if (!user) {
			callback({ errors: [{ msg: "Invalid credentials" }] });
			return;
		}
		// Match the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			callback({ errors: [{ msg: "Invalid credentials" }] });
			return;
		}

		// Return jsonwebtoken
		const payload = {
			user: {
				id: user.id
			}
		};
		jsonwebtoken.sign(
			payload,
			config.get("JWTKEY"),
			{ expiresIn: 360000 },
			(err, token) => {
				if (err) throw err;
				callback({ token });
			}
		);

	} catch (err) {
		console.log(err.message);
		callback("Server error");
	}
};


// // @route POST api/login
// // @desc Authenticate user & get token
// // @access Public
// router.post(
// 	"/",
// 	[
// 		check("email", "Please enter a valid email").isEmail(),
// 		check("password", "Password is required").exists()
// 	],
// 	async (req, res) => {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() });
// 		}
// 		const { email, password } = req.body;
// 		try {
// 			// Check if user exists
// 			let user = await User.findOne({ email });
// 			if (!user) {
// 				return res
// 					.status(400)
// 					.json({ errors: [{ msg: "Invalid credentials" }] });
// 			}
// 			// Match the password
// 			const isMatch = await bcrypt.compare(password, user.password);
// 			if (!isMatch) {
// 				return res
// 					.status(400)
// 					.json({ errors: [{ msg: "Invalid credentials" }] });
// 			}

// 			// Return jsonwebtoken
// 			const payload = {
// 				user: {
// 					id: user.id
// 				}
// 			};
// 			jsonwebtoken.sign(
// 				payload,
// 				config.get("JWTKEY"),
// 				{ expiresIn: 360000 },
// 				(err, token) => {
// 					if (err) throw err;
// 					res.json({ token });
// 				}
// 			);

// 		} catch (err) {
// 			console.log(err.message);
// 			res.status(500).send("Server error");
// 		}
// 	}
// );

module.exports = Login;