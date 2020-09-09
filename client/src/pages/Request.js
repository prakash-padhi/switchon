import React from 'react';
import { Container, Row, Col, Card, CardBody, CardText, CardHeader, CardTitle, CardFooter, Button, ButtonGroup, Badge, UncontrolledAlert } from 'reactstrap';

const Request = ({ alert, data, deptTasks, emitSocket }) => {
    const requestedTasks = deptTasks.filter(el => el.status === "Requested");

    const approveTask = e => emitSocket({ taskType: 'approve', taskData: e });
    const rejectTask = e => emitSocket({ taskType: 'reject', taskData: e });

    return (
        <Container className="themed-container">
            <Row className="mt-2">
                { alert !== null ?
                <Col md={12}>
                    <UncontrolledAlert color={alert.type}>
                        { alert.msg }
                    </UncontrolledAlert>
                </Col> : null }
                { requestedTasks.length ?
                <React.Fragment>
                    { requestedTasks.map((el, index) => (
                        <Col key={index} md={4}>
                            <Card className="mb-3">
                                <CardHeader>{`Assigned to ${el.assignedTo === data.userData.email ? "me" : el.assignedTo}`}</CardHeader>
                                <CardBody>
                                    <CardTitle>Status : <Badge pill color="dark">{el.status}</Badge></CardTitle>
                                    <CardText>{`Message : ${el.message}`}</CardText>
                                    { el.assignedTo === data.userData.email ? 
                                    <ButtonGroup>
                                        <Button onClick={() => approveTask(el)}>Approve</Button>
                                        <Button onClick={() => rejectTask(el)}>Reject</Button>
                                    </ButtonGroup> : null }
                                </CardBody>
                                <CardFooter>{`Assigned by ${el.createdBy}`}</CardFooter>
                            </Card>
                        </Col>
                    ))}
                </React.Fragment> : <Col md={12} className="text-center">No requested tasks found!</Col> }
            </Row>
        </Container>
    );
};

export default Request;