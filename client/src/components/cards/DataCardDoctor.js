import React, { Component } from 'react'
import { Form, Button, Col, Card } from 'react-bootstrap';
import rsaDecrypt from '../../utils/rsaDecrypt';

export default class DataCardDoctor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formShow: false,
      query: '',
      prescription: '',
    }
  }

  async decryptFormHandle() {

    let hash = this.props.hashData; 
    let privateKey = this.refs.privateKey.value;
    // e.preventDefault();
    console.log("HASH", hash);
    console.log("HASH", privateKey);

    var presDoc = this.props.cardPrescription;
    var queryDoc = this.props.cardQuery;
    // {
    // 
    // if (r.hashData.toString() === hash) {
    // console.log("R", r);
    // console.log("RQUERY", r.query);
    // return r
    // };
    // })

    console.log("GET DATA of HASH", queryDoc);
    console.log("GET DATA of HASH", presDoc);

    try {
      var QUERY = await rsaDecrypt(this.props.publicKey, privateKey, queryDoc.toString());
      console.log("QUERY", QUERY);
      if (QUERY.result && this.props.prescription !== '-') {
        var PRESCRIPTION = await rsaDecrypt(this.props.publicKey, privateKey, presDoc.toString());
        console.log("PRESC", PRESCRIPTION);
        if (PRESCRIPTION.result) {
          this.setState({
            query: QUERY.data,
            prescription: PRESCRIPTION.data,
            formShow: false
          })
        }
        else {
          console.log("PRESCRIPTION NOT DECRYPTED", PRESCRIPTION.data);

        }
      }
      else if (QUERY.result && this.props.prescription === '-') {
        this.setState({
          query: QUERY.data,
          formShow: false
        });
      }
      else {
        console.log("QUERY NOT DECRYPTED", QUERY.data);
      }
    } catch (err) {
      console.log("ERROR IN DECRYPT", err);
    }


    this.setState({ decryptForm: false })
  }

  render() {
    return (
      <Col md="6" style={{ marginBottom: 10 }}>
        <Card>
          <Card.Body>
            <Card.Text>

              <p><span style={{ fontWeight: "bold" }}> PATIENT: </span>{this.props.patient}</p>
              <p><span style={{ fontWeight: "bold" }}> HASH: </span>{this.props.hashData}</p>
              <p><span style={{ fontWeight: "bold" }}> QUERY: </span>{this.state.query ? this.state.query : this.props.data}</p>
              <p><span style={{ fontWeight: "bold" }}> PRESCRIPTION: </span>{this.state.prescription ? this.state.prescription : this.props.prescription}</p>
              {
                this.state.formShow ? (
                  <Form>

                    <Form.Group controlId="addressDoc">
                      <Form.Label>Your Private Key</Form.Label>
                      <Form.Control type="text" placeholder="Enter your private key" ref='privateKey' />
                    </Form.Group>

                    <Button variant="primary" onClick={this.decryptFormHandle.bind(this)}>Submit</Button>

                  </Form>
                ) : (
                    <Button onClick={() => {
                      console.log("CARD BUTTON FORM CLICK CHANGE");
                      this.setState({ formShow: true })
                    }}>Decrypt Data</Button>
                  )
              }

            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    )
  }
}

