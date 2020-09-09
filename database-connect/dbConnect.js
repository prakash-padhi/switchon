const mongoose = require("mongoose");
const config = require("config");

// For Mongo Atlas Database
const db = config.get("dbURL");
// For Local MongoDB
//const db = config.get("dbLocalURL")

const connectDB = async () => {
	try {
		await mongoose
			.connect(db, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			})
			.then(response => {
				console.log("DATABASE CONNECTED");
			});
	} catch (err) {
		console.log(err.message);
		//Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
