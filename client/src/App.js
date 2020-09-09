import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import { Spinner } from 'reactstrap';
import io from 'socket.io-client';
import NavBar from './components/NavBar';
import routes from './routes/routes';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
	position: "top-center",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: true,
	progress: undefined,
	style: { fontSize: 12, fontWeight: "bold" }
});

const socket = io.connect('https://switch-on.herokuapp.com/');

function App() {
	const [depts, setDepts] = React.useState([]);
	const [userData, setUserData] = React.useState({
		loading: true,
		auth: false,
		userData: null,
	});
	const [userTasks, setUserTasks] = React.useState([]);
	const [deptTasks, setDeptTasks] = React.useState([]);
	const [alert, setAlert] = React.useState(null);
	const [taskAlert, setTasksAlert] = React.useState(null);

	const afterLogin = (formData) => {
		setUserData({
			...userData,
			loading: true
		});
		socket.emit('login', formData);
        socket.on('loggedin', (data) => {
			if (data.token) {
				localStorage.setItem('token', data.token);
				setAlert({ msg: "Logged in successfully...", type: 'success' });
				connectToSocket();
			}
			else if (data.errors) {
				setAlert({ msg: data.errors[0].msg, type: 'danger' });
				setUserData({
					...userData,
					loading: false
				});
			}
			else {
				setUserData({
					...userData,
					loading: false
				});
			}
		});
		setTimeout(() => {
			setAlert(null);
		}, 5000);
	};

	const afterRegister = ({ userName, userEmail, userDept, userPassword }) => {
		const formData = {
			name: userName,
			email: userEmail,
			department: userDept,
			password: userPassword
		};
		socket.emit('register', formData);
		socket.on('registered', (data) => {
			if (data.successMsg) setAlert({ msg: data.successMsg, type: 'success' });
			else if (data.errors) setAlert({ msg: data.errors[0].msg, type: 'danger' });
		});
		setTimeout(() => {
			setAlert(null);
		}, 5000);
	};

	const afterLogout = () => {
		socket.emit('logout', userData);
		setTasksAlert(null);
		setUserTasks([]);
		setDeptTasks([]);
		setUserData({
			loading: false,
			auth: false,
			userData: null
		});
		setAlert({ msg: "Logged out successfully...", type: 'success'});
		setTimeout(() => {
			setAlert(null);
		}, 5000);
	};

	const alertCase = (taskType) => {
		switch (taskType) {
			case 'addtask':
				setAlert({ msg: "Task Added...", type: "success" });
				break;
			case 'reject':
				setAlert({ msg: "Task Rejected...", type: "danger" });
				break;
			case 'approve':
				setAlert({ msg: "Task Approved...", type: "success" });
				break;
			default:
				break;
		}
		setTimeout(() => {
			setAlert(null);
		}, 5000);
	};

	const emitSocket = (data) => {
		socket.emit([data.taskType], data.taskData);
		alertCase(data.taskType);
	};

	const connectToSocket = () => {
		socket.emit('getdepts');
		socket.emit('authenticate', { token: localStorage.token })
		.on('unauthorized', () => {
			console.log("Unauthorized");
			setUserData({
				loading: false,
				auth: false,
				userData: null
			});
		})
		.on('getdata', (data) => {
			setUserData({
				loading: false,
				auth: true,
				userData: data
			});
		})
		.on('alldepts', (data) => {
			setDepts(data);
		})
		.on('userTasks', (data) => {
			setUserTasks(data);
		})
		.on('deptTasks', (data) => {
			setDeptTasks(data);
		})
		.on('addedtask', (data) => {
			setTasksAlert(data);
			console.log(data);
			toast.info(`Task assigned to ${data.assignedTo} by ${data.createdBy}`, { toastId: 1 });
		})
		.on('approved', (data) => {
			console.log(data);
			setTasksAlert(data);
			toast.success(`A task by ${data.createdBy} has been approved`, { toastId: 2 });
		})
		.on('rejected', (data) => {
			setTasksAlert(data);
			toast.error(`A task by ${data.createdBy} has been rejected`, { toastId: 3 });
		});
	};

	useEffect(() => {
		connectToSocket();
	}, []);

	const menu = routes.map((route, index) => {
		return (route.component) ? (
			<Route
				key={index}
				path={route.path}
				exact={route.exact}
				name={route.name}
				render={props => (
					userData.loading ? <div className="text-center my-4"><Spinner color="success" /></div> : userData.auth ? <route.component emitSocket={(data) => emitSocket(data)} alert={alert} depts={depts} data={userData} userTasks={userTasks} deptTasks={deptTasks} {...props} /> : <Redirect to="/" />
				)} />
		) : (null);
	});


	return (
		<Fragment>
			<Router>
				<NavBar afterLogout={() => afterLogout()} loading={userData.loading} taskAlert={taskAlert} auth={userData.auth} />
				<React.Suspense fallback={<div className="text-center my-4"><Spinner color="success" /></div>}>
					<Switch>
						{ menu }
						<Route path="/" exact render={(props) => (
							<Landing {...props} afterRegister={(data) => afterRegister(data)} afterLogin={(data) => afterLogin(data)} depts={depts} alert={alert} auth={userData.auth} loading={userData.loading} />
						)} />
						<Route path="*" component={NotFound} />
					</Switch>
				</React.Suspense>
			</Router>
		</Fragment>
	);
}

export default App;
