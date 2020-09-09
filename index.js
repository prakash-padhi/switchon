const express = require("express");
const server = express();
const path = require("path");
const connectMongoDB = require("./database-connect/dbConnect");
const config = require('config');
const Login = require('./routes/login');
const Register = require('./routes/register');
const User = require("./models/user");
const Dept = require("./models/department");
const Task = require("./models/task");
const jsonwebtoken = require('jsonwebtoken');

//Connect to MongoDB
connectMongoDB();

// Init Middleware
server.use(express.json({ extended: false }));

if (process.env.NODE_ENV === "production") {
  server.use(express.static(path.join(__dirname, 'client/build')));
	server.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}


const PORT = 8080;

const app = server.listen(process.env.PORT || PORT, function(){
    console.log("Server is running on PORT"+ " "+ PORT);
});

const io = require('socket.io')(app);

io.on('connection', function (socket) {
  socket.on('authenticate', async ({ token }) => {
    if (token) {
      const decoded = jsonwebtoken.verify(token, config.get("JWTKEY"));
      if (decoded.user) {
        socket.emit('authenticated');
        const user = await User.findById(decoded.user.id).select("-__v -password -tasks");
        const tasks = await Task.find({ assignedTo: user.email }).select("-__v");
        const deptTasks = await Task.find({ assignedDept: user.department }).select("-__v");
        socket.join(user.email);
        socket.join(user.department);
        socket.emit('deptTasks', deptTasks);
        socket.emit('userTasks', tasks);
        socket.emit('getdata', user);
      }
    }
    else socket.emit('unauthorized', { error: true });
  });

  socket.on('addtask', async (data) => {
    try {
      const dataObj = {
        assignedDept: data.selectedDepartment,
				createdBy: data.createdBy,
        assignedTo: data.selectedUser,
        message: data.messageField,
        status: "Requested"
      };
      await new Task(dataObj).save();
      const userTasks = await Task.find({ assignedTo: data.selectedUser }).select("-__v");
      const deptTasks = await Task.find({ assignedDept: data.selectedDepartment }).select("-__v");
      socket.to(data.selectedDepartment).emit('deptTasks', deptTasks);
      socket.to(data.selectedUser).emit('userTasks', userTasks);
      socket.to(data.selectedDepartment).emit('addedtask', dataObj);
    } catch (err) {
      console.log(err);
      socket.emit('addedtask', { error: true });
    }
  });

  socket.on('approve', async (el) => {
    await Task.findByIdAndUpdate(el._id, { status: "Approved" });
    const userTasks = await Task.find({ assignedTo: el.assignedTo }).select("-__v");
    const deptTasks = await Task.find({ assignedDept: el.assignedDept }).select("-__v");
    io.in(el.assignedDept).emit('deptTasks', deptTasks);
    io.in(el.assignedTo).emit('userTasks', userTasks);
    io.in(el.assignedDept).emit('approved', el);
  });

  socket.on('reject', async (data) => {
    await Task.findByIdAndUpdate(data._id, { status: "Rejected" });
    const userTasks = await Task.find({ assignedTo: data.assignedTo }).select("-__v");
    const deptTasks = await Task.find({ assignedDept: data.assignedDept }).select("-__v");
    io.in(data.assignedDept).emit('deptTasks', deptTasks);
    io.in(data.assignedTo).emit('userTasks', userTasks);
    io.in(data.assignedDept).emit('rejected', data);
  });

  socket.on("logout", (data) => {
    socket.leave(data.userData.department);
  });

  socket.on("login", (data) => {
    const callback = data => {
      socket.emit('loggedin', data);
    };  
    Login(data, callback);  
  });

  socket.on("register", async (data) => {
    const callback = data => {
        socket.emit('registered', data);
    };
    Register(data, callback);
  });

  socket.on("getdepts", async () => {
    const depts = await Dept.find({}).select("-_id -__v -tasks");
    socket.emit('alldepts', depts);
  });

});