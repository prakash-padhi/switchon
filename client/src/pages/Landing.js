import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Form, FormGroup, Label, Input, Card, Button, CardBody, Spinner, UncontrolledAlert, CustomInput } from "reactstrap";

const Landing = ({ loading, auth, depts, afterLogin, afterRegister, alert }) => {

    const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
	  if(activeTab !== tab) setActiveTab(tab);
    }
    
	const [formData, setFormData] = useState({
		email: "",
		password: ""
    });
    
	const [registerFormData, setRegisterFormData] = useState({
		userName: "",
        userEmail: "",
        userDept: "",
		userPassword: ""
    });

	if (auth) {
		return <Redirect to="/home" />;
	}

	const { email, password } = formData;

	const { userName, userEmail, userDept, userPassword } = registerFormData;
    
	const _handleChange = e => {
		setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
	};

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

	const _handleSubmit = async e => {
        e.preventDefault();
        afterRegister(registerFormData);
        setRegisterFormData({
            userName: "",
            userEmail: "",
            userDept: userDept,
            userPassword: ""
        });
    };
    
	const onSubmit = async e => {
        e.preventDefault();
        afterLogin(formData);
    };

	return (
		<Fragment>
			<Container className="themed-container">
				<div className="Landing__Form-Wrapper">
					<Fragment>
                        {!loading ? (
                            <div>
                                <Nav tabs>
                                    <NavItem className="w-50">
                                    <NavLink className={`${classnames({ active: activeTab === '1' })} ${ activeTab === '1' ? 'fw-700 text-success' : 'text-dark'} text-center`}
                                        onClick={() => { toggle('1'); }}
                                    >
                                        Log In
                                    </NavLink>
                                    </NavItem>
                                    <NavItem className="w-50">
                                    <NavLink
                                        className={`${classnames({ active: activeTab === '2' })} ${ activeTab === '2' ? 'fw-700 text-success' : 'text-dark'} text-center `}
                                        onClick={() => { toggle('2'); }}
                                    >
                                        Sign Up
                                    </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                            <Fragment>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                { alert !== null ?
                                                                <UncontrolledAlert color={alert.type}>
                                                                    { alert.msg }
                                                                </UncontrolledAlert> : null }
                                                                <Row className="form__wrapper">
                                                                    <Col lg="12">
                                                                        <Form id="userLogin" onSubmit={e => onSubmit(e)}>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <Label for="adminEmail" className="mr-sm-2">
                                                                                    Email
                                                                                </Label>
                                                                                <Input
                                                                                    type="email"
                                                                                    name="email"
                                                                                    id="adminEmail"
                                                                                    value={email}
                                                                                    onChange={e => onChange(e)}
                                                                                    bsSize="lg"
                                                                                    required
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <Label for="adminPassword" className="mr-sm-2">
                                                                                    Password
                                                                                </Label>
                                                                                <Input
                                                                                    type="password"
                                                                                    name="password"
                                                                                    id="adminPassword"
                                                                                    value={password}
                                                                                    onChange={e => onChange(e)}
                                                                                    bsSize="lg"
                                                                                    required
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-4 mb-sm-4">
                                                                                <Button
                                                                                    className="login__submit"
                                                                                    type="submit"
                                                                                    size="lg"
                                                                                    block
                                                                                >
                                                                                    <FiLogIn /> Log In
                                                                                </Button>
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <p className="in-out text-center mt-4">Don't have an account?
                                                                                    <span className="ml-2 Return__To" onClick={() => { toggle('2'); }}>Sign Up Here</span>
                                                                                </p>
                                                                            </FormGroup>
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Fragment>
                                        </Col>
                                    </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                    <Row>
                                        <Col sm="12">
                                            <Fragment>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                { alert !== null ?
                                                                <UncontrolledAlert color={alert.type}>
                                                                    { alert.msg }
                                                                </UncontrolledAlert> : null }
                                                                <Row className="form__wrapper">
                                                                    <Col lg="12">
                                                                        <Form id="userRegister" onSubmit={e => _handleSubmit(e)}>
                                                                        <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <Label for="userName" className="mr-sm-2">
                                                                                    Name
                                                                                </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    name="userName"
                                                                                    id="userName"
                                                                                    value={userName}
                                                                                    onChange={e => _handleChange(e)}
                                                                                    bsSize="lg"
                                                                                    required
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <Label for="userEmail" className="mr-sm-2">
                                                                                    Email
                                                                                </Label>
                                                                                <Input
                                                                                    type="email"
                                                                                    name="userEmail"
                                                                                    id="userEmail"
                                                                                    value={userEmail}
                                                                                    onChange={e => _handleChange(e)}
                                                                                    bsSize="lg"
                                                                                    required
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <Label for="deptSelect">Department</Label>
                                                                                <CustomInput required onChange={e => _handleChange(e)} className="form-control-lg" type="select" name="userDept" id="deptSelect">
                                                                                    <option value="">Select Deparment</option>
                                                                                    { depts.map((el, i) => (
                                                                                        <option key={i}>{el.deptName}</option>
                                                                                    ))}
                                                                                </CustomInput>
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <Label for="userPassword" className="mr-sm-2">
                                                                                    Password
                                                                                </Label>
                                                                                <Input
                                                                                    type="password"
                                                                                    name="userPassword"
                                                                                    id="userPassword"
                                                                                    value={userPassword}
                                                                                    onChange={e => _handleChange(e)}
                                                                                    bsSize="lg"
                                                                                    required
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-4 mb-sm-4">
                                                                                <Button
                                                                                    className="register__submit"
                                                                                    type="submit"
                                                                                    size="lg"
                                                                                    block
                                                                                >
                                                                                    <FiUserPlus /> Sign Up
                                                                                </Button>
                                                                            </FormGroup>
                                                                            <FormGroup className="mt-sm-2 mb-sm-2">
                                                                                <p className="in-out text-center mt-4">Already have an account? 
                                                                                    <span className="ml-2 Return__To" onClick={() => { toggle('1'); }}>Log In Here</span>
                                                                                </p>
                                                                            </FormGroup>
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Fragment>
                                        </Col>
                                    </Row>
                                    </TabPane>
                                </TabContent>
                            </div>
                        ) : (
                            <div className="text-center my-4">
                                <Spinner color="success" size="md" />
                            </div>
                        )} 
                    </Fragment>
				</div>
			</Container>
		</Fragment>
	);
};


export default Landing;
