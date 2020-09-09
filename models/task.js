const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	assignedDept: {
		type: String
    },
    createdBy: {
        type: String,
    },
    assignedTo: {
        type: String
    },
    status: {
        type: String
    },
    message: {
        type: String
    }
});

module.exports = Task = mongoose.model("tasks", TaskSchema);