import React, { useState } from 'react';
import { Container, Form, FormGroup, Spinner, Label, Input, Card, CardHeader, CardBody, Button, CustomInput, UncontrolledAlert, Row, Col } from "reactstrap";

const Homepage = ({ depts, alert, data, emitSocket }) => {
    const [error, setError] = useState({
        deptSelect: false,
        userSelect: false
    });

    const [formData, setFormData] = useState({
        createdBy: data.userData.email,
        selectedDepartment: "",
        selectedUser: "",
        messageField: ""
    });

    const [extraForm, setExtraForm] = useState({
        departments: depts.length ? depts.filter(el => el.deptName !== data.userData.department) : [],
        users: []
    });

    const { createdBy, selectedDepartment, selectedUser, messageField } = formData;
    const { departments, users } = extraForm;

    const _handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDepartment !== "" && selectedUser !== "") {
            emitSocket({ taskType: 'addtask', taskData: formData });
            setFormData({ 
                createdBy: data.userData.email,
                selectedDepartment: "",
                selectedUser: "",
                messageField: ""
            });
        }
        else {
            if (selectedUser === "") setError({ ...error, userSelect: true });
            if (selectedDepartment === "") setError({ ...error, deptSelect: true });
        }
    };

    const _onChange = (e) => {
        setError({ ...error, userSelect: false });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const _deptSelect = (e) => {
        setError({ ...error, deptSelect: false });
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.value !== "") {
            setExtraForm({
                ...extraForm,
                users: departments.find(el => el.deptName === e.target.value).users
            });
        }
        else setExtraForm({ ...extraForm, users: [] });
    };

    return (
        <Container className="themed-container">
            {!data.loading ?
                <div className="Landing__Form-Wrapper">
                    <Card>
                        <CardHeader className="text-center">
                            Assign Task
                        </CardHeader>
                        <CardBody>
                            { alert !== null ?
                            <UncontrolledAlert color={alert.type}>
                                { alert.msg }
                            </UncontrolledAlert> : null }
                            <Row className="form__wrapper">
                                <Col lg="12">
                                    <Form id="addTask" onSubmit={(e) => _handleSubmit(e)}>
                                        <FormGroup className="mt-sm-2 mb-sm-2">
                                            <Label for="createdBy">Created by</Label>
                                            <Input className="form-control-md" type="text" name="createdBy" id="createdBy" value={createdBy} readOnly />
                                        </FormGroup>
                                        <FormGroup className="mt-sm-2 mb-sm-2">
                                            <Label for="selectedDepartment">Select Department</Label>
                                            <CustomInput required onChange={(e) => _deptSelect(e)} className="form-control-md" type="select" name="selectedDepartment" id="selectedDepartment">
                                                <option value="">Select Department</option>
                                                {departments.map((el, i) => (
                                                    <option key={i}>{el.deptName}</option>
                                                ))}
                                            </CustomInput >
                                            { error.deptSelect ? <span className="text-danger">Please select a department</span> : null }
                                        </FormGroup>
                                        <FormGroup className="mt-sm-2 mb-sm-2">
                                            <Label for="selectedUser">Select User</Label>
                                            <CustomInput required onChange={(e) => _onChange(e)} className="form-control-md" type="select" name="selectedUser" id="selectedUser">
                                                <option value="">Select User</option>
                                                {users.map((el, i) => (
                                                    <option value={el.email} key={i}>{el.name}</option>
                                                ))}
                                            </CustomInput >
                                            { error.userSelect ? <span className="text-danger">Please select a user</span> : null }
                                        </FormGroup>
                                        <FormGroup className="mt-sm-2 mb-sm-2">
                                            <Label for="messageField">Message Field</Label>
                                            <Input required onChange={(e) => _onChange(e)} type="textarea" name="messageField" value={messageField} id="messageField" />
                                        </FormGroup>
                                        <FormGroup className="mt-sm-4 mb-sm-4">
                                            <Button className="assign_task" type="submit" size="lg" block>
                                                Assign
                                            </Button>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            : <div className="text-center my-4"><Spinner color="success" /></div> }
        </Container>
    );
};

export default Homepage;