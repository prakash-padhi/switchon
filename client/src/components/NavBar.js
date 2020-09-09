import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsBellFill } from "react-icons/bs";
//import { logout } from "../actions/auth";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, Button, PopoverBody, UncontrolledPopover, CardText, Card, CardTitle, CardFooter, CardBody } from "reactstrap";

const MyNavbar = ({ loading, auth, taskAlert, afterLogout }) => {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const toggleButton = <NavbarToggler onClick={toggle} />;
	
	const _handleLogout = () => {
		localStorage.removeItem('token');
		afterLogout();
	};

	const togglePop = () => setPopoverOpen(!popoverOpen);
    
	const authLinks = (
		<Collapse isOpen={isOpen} navbar>
			<Nav className="m-auto" navbar>
                <NavItem>
					<Link to="/pending" className="nav-link">
						Pending
					</Link>
				</NavItem>
				<NavItem>
					<Link to="/rejected" className="nav-link">
						Rejected
					</Link>
				</NavItem>
				<NavItem>
					<Link to="/approved" className="nav-link">
						Approved
					</Link>
				</NavItem>
                <NavItem>
					<Link to="/request" className="nav-link">
						Request(for Approval)
					</Link>
				</NavItem>
			</Nav>
			<Nav className="ml-auto" navbar>
				<NavItem>
					<Link to="#" className="nav-link">
						<Button size="sm" id="Popover1" variant="outline-danger" className="btn-icon btn-rounded">
							<BsBellFill />
						</Button>
						<UncontrolledPopover className={ taskAlert && 'alert-popover' } placement="bottom" isOpen={popoverOpen} target="Popover1" trigger="legacy" toggle={togglePop}>
							<PopoverBody>
								{ taskAlert ? 
									<Card>
										<CardBody>
											<CardTitle>{`Assigned to ${taskAlert.assignedTo}`}</CardTitle>
											<CardText>{`Message : ${taskAlert.message}`}</CardText>
											<Link to="/pending">
												<Button color="success" block>Tasks</Button>
											</Link>
										</CardBody>
										<CardFooter className="text-muted">{`Assigned by ${taskAlert.createdBy}`}</CardFooter>
									</Card>
								: <p className="my-2">No new alerts to show</p> }
							</PopoverBody>
						</UncontrolledPopover>
					</Link>
				</NavItem>
                <NavItem>
					<Link to="#" className="nav-link">
						<Button onClick={() => _handleLogout()} size="sm" variant="outline-danger">Logout</Button>
					</Link>
				</NavItem>
			</Nav>
		</Collapse>
	);
	return (
		<div id="navBar__wrapper" className="py-2 container">
			<Navbar className={ !loading ? !auth ? "justify-content-center" : "" : ""} color="dark" dark expand="md">
				<Link to={!auth ? '/' : '/home' } className="m-0 navbar-brand" style={{ padding: "0 .5rem"}}>
					<p className="brandLogo m-0 py-2">
						<span className="brandName">switchon</span>
					</p>
				</Link>
				{ auth && toggleButton }
				{ auth && authLinks }
			</Navbar>
		</div>
	);
};

export default MyNavbar;
