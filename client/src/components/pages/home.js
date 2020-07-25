import React, { Component } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import "../../App.css";

import { connect } from 'react-redux';

class Home extends Component {

  componentDidMount() {
    console.log("PROPS IN HOME", this.props);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }} >
            <Card className="text-center">
              <Card.Body>
                <Card.Title as="h2">Welcome to Health Care</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

export default connect(mapStateToProps)(Home);