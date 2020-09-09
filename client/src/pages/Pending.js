import React from 'react';
import { Container, Row, Col, Card, CardBody, CardText, CardTitle, CardFooter, Button, ButtonGroup, Badge, UncontrolledAlert } from 'reactstrap';

const Pending = ({ alert, userTasks, emitSocket }) => {
    const pendingTasks = userTasks.filter(el => el.status === "Requested");

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
                { pendingTasks.length ?
                <React.Fragment>
                    { pendingTasks.map((el, index) => (
                        <Col key={index} md={4}>
                            <Card className="mb-3">
                                <CardBody>
                                    <CardTitle>Status : <Badge pill color="primary">{el.status}</Badge></CardTitle>
                                    <CardText>{`Message : ${el.message}`}</CardText>
                                    <ButtonGroup>
                                        <Button onClick={() => approveTask(el)}>Approve</Button>
                                        <Button onClick={() => rejectTask(el)}>Reject</Button>
                                    </ButtonGroup>
                                </CardBody>
                                <CardFooter>{`Assigned by ${el.createdBy}`}</CardFooter>
                            </Card>
                        </Col>
                    ))}
                </React.Fragment> : <Col md={12} className="text-center">No assigned tasks found!</Col> }
            </Row>
        </Container>
    );
};

export default Pending;