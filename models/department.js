const mongoose = require("mongoose");

const DeptSchema = new mongoose.Schema({
	deptName: {
		type: String
    },
    users: {
        type: Array,
        default: []
    }
});

module.exports = Departments = mongoose.model("departments", DeptSchema);