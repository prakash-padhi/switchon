import React from 'react';
import { Container, Row, Col, Card, CardBody, CardText, CardTitle, CardFooter, Badge } from 'reactstrap';

const Approved = ({ userTasks }) => {
    const approvedTasks = userTasks.filter(el => el.status === "Approved");
    return (
        <Container className="themed-container">
            <Row className="mt-2">
                { approvedTasks.length ?
                <React.Fragment>
                    { approvedTasks.map((el, index) => (
                        <Col key={index} md={4}>
                            <Card className="mb-3">
                                <CardBody>
                                    <CardTitle>Status : <Badge pill color="success">{el.status}</Badge></CardTitle>
                                    <CardText>{`Message : ${el.message}`}</CardText>
                                </CardBody>
                                <CardFooter>{`Assigned by ${el.createdBy}`}</CardFooter>
                            </Card>
                        </Col>
                    ))}
                </React.Fragment> : <Col md={12} className="text-center">No approved tasks found!</Col> }
            </Row>
        </Container>
    );
};

export default Approved;