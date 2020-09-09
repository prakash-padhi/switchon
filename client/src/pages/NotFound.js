import React from 'react';
import { Container } from 'reactstrap';

class NotFound extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <Container className="themed-container">
                <p className="my-4 text-center">Not Found :)</p>
            </Container>
        );
    }
}

export default NotFound;