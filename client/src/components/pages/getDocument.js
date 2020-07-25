import React, { Component } from "react";
import { findDOMNode } from "react-dom";

import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

import AES from 'crypto-js/aes';
import enc from 'crypto-js/enc-latin1';
import ipfs from '../../ipfs';

import { connect } from 'react-redux';

class Download extends Component {

  componentDidMount() {

    console.log("GET DOCUMENTFROM IPFS", this.props);

  }

  getFile(e) {
    e.preventDefault();
    var file = findDOMNode(this.refs.fileHash).value;
    var element = findDOMNode(this.refs.downloadLink);
    console.log(file);
    console.log(element);

    ipfs.files.get(file.toString(), function (err, res) {
      if (err) {
        console.log("Error", err);
      }
      else {
        console.log("RESPONSE\n", res);
        console.log("RESPONSE PATH\n", res[0].path);
        var cont = res[0].content.toString('utf8');
        console.log("RESPONSE CONTENT\n", cont);

        // var n = cont.slice(30, cont.length)

        // console.log(n);
        // console.log(cont[20:cont.length()])
        // data:application/octet-stream,
        var decrypted = AES.decrypt(cont.toString(), "qwertyuiop").toString(enc);

        console.log("DECRYPT\n", decrypted);
        console.log("\nDECRYPT\n", decrypted.toString());

        element.setAttribute('href', decrypted);
        element.setAttribute('download', "FILE_DECRYPTED");
      }
    })

  }

  render() {
    return (

      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Download Data File</Card.Title>
                  <Form onSubmit={this.getFile.bind(this)}>

                    <Form.Group controlId="fileHash">
                      <Form.Label>File Hash</Form.Label>
                      <Form.Control type="text" placeholder="Enter File Hash" ref='fileHash' />
                    </Form.Group>

                    <Button variant="primary" type="submit">Get File</Button>

                    <Button variant="success" style={{ marginLeft: "5px" }}><a ref="downloadLink"> Click here to download</a></Button>

                  </Form>
                  <small style={{ marginLeft: "5px" }}>If file type is not automatically detected, then save it with '.docx' extention</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

export default connect(mapStateToProps)(Download);