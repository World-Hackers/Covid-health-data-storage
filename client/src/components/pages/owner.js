import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

import AES from 'crypto-js/aes';
import ipfs from '../../ipfs';

import "../../App.css";

import { connect } from 'react-redux';

class Upload extends Component {

  state = {
    acc: null,
    publicKey: null,
    encrypted: null,
    hash: null,
    patients: [],
    doctors: [],
  };

  componentDidMount() {
    console.log("PROPS IN UPLOAD", this.props);
    console.log("STATE IN UPLOAD", this.state);

    var inst = this.props.state.contract;

    this.props.state.web3.eth.getAccounts().then(function (acc) {
      // this.sendReq(acc);
      console.log("ACCOUNT", acc);
      console.log(inst);
      console.log(inst.methods);
      this.setState({ acc: acc })
      console.log("STATE", this.state);
      return inst.methods.getPublicKey(acc.toString()).call({from: acc.toString()});
    }.bind(this)).then(function(publicKey){
      console.log("ACCOUNT", publicKey);
      this.setState({ publicKey: publicKey })
      return inst.methods.getAllPatients().call({ from: this.state.acc.toString() })
    }.bind(this)).then(function (res) {
      this.setState({ patients: res });
      return inst.methods.getAllDoctors().call({ from: this.state.acc.toString() })
    }.bind(this)).then(function (res) {
      this.setState({ doctors: res });
    }.bind(this))
  }

  loadHash() {


    var inst = this.props.state.contract;


    this.props.state.web3.eth.getAccounts().then(function (acc) {
      console.log("ACCOUNT", acc);
      console.log(inst);
      console.log(inst.methods);
      this.setState({ acc: acc })
      console.log("STATE", this.state);
      return inst.methods.addFile(this.state.hash.toString()).send({ from: this.state.acc.toString() })
    }.bind(this)).then(function (res) {
      console.log("AFTER FUNCTION", res)
    }).catch(function (err) {
      console.log(err);
    })


  }

  encryptFile(f) {
    var reader = new FileReader();

    console.log("STATE IN UPLOAD", this.state);

    reader.onloadend = () => {

      console.log("RES", reader.result);

      var r = AES.encrypt(reader.result, "qwertyuiop");

      console.log("ENCRYPTED", r);

      console.log("LINK", 'data:application/octet-stream,' + r);

      this.setState({ encrypted: r.toString() })
      console.log("AFTER SETING", this.state)

    }
    reader.readAsDataURL(f);

    setTimeout(() => {
      ipfs.files.add(Buffer(this.state.encrypted), function (err, res) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(res);
          this.setState({ hash: res[0].hash })
          console.log(this.state);
          this.loadHash();
        }
      }.bind(this))
    }, 10000);
  }

  addFile(e) {
    e.preventDefault();
    const file = this.refs.fileUpload.files[0];
    console.log(file, "\n\n");
    this.encryptFile(file);
  }

  // addDoctor(){
  //     e.preventDefault();
  //     const doc = this.refs.docAdd.value;

  //     var inst = this.props.state.contract;
  // }

  mintCoin(e) {
    e.preventDefault();
    var currentAcc;
    var token = this.props.state.tokenContract;
    var add = this.refs.userAdd.value;

    this.props.state.web3.eth.getAccounts().then(function (acc) {
      // this.sendReq(acc);
      console.log("ACCOUNT", acc);
      console.log(token);
      console.log(token.methods);
      currentAcc = acc;
      return token.methods.mint(add, 1000).send({ from: currentAcc.toString() })
    }).then(function (minted) {
      console.log(minted)
      // console.log(added.events.PatientAdded.event)
      // console.log(added.events.PatientAdded.returnValues.Patient)
    })
  }


  render() {

    var patients = this.state.patients;
    var doctors = this.state.doctors;

    var patientList = patients.length === 0 ? function () { console.log(patients.length); return (<div>"No Data"</div>) } : patients.map(function (file, index) {
      console.log(patients.length);
      return <ListGroup.Item key={index}>{file}</ListGroup.Item>
    });

    var doctorList = doctors.length === 0 ? function () { console.log(doctors.length); return (<div>"No Data"</div>) } : doctors.map(function (file, index) {
      console.log(doctors.length);
      return <ListGroup.Item key={index}>{file}</ListGroup.Item>
    });

    if (this.state.acc === null) {
      return (
        <div style={{ marginLeft: "10px", paddingRight: "50px" }}>Loading...</div>
      )
    }
    else if (this.state.acc[0] === this.props.state.owner) {

      return (

        <Container>

          <Row>
            <Col>

              <Card>
                <Card.Body>
                  <Card.Title>List All Patients</Card.Title>
                    <ListGroup>
                      {patientList}
                    </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col>

              <Card>
                <Card.Body>
                  <Card.Title>List All Doctors</Card.Title>
                    <ListGroup>
                      {doctorList}
                    </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col md={{ span: 6, offset: 3 }}>

              <Card>
                <Card.Body>
                  <Card.Title>Mint 1000 token in account</Card.Title>
                    <Form onSubmit={this.mintCoin.bind(this)}>

                      <Form.Group controlId="nameHosp">
                        <Form.Label>Address to mint in</Form.Label>
                        <Form.Control type="text" placeholder="Enter Address" ref='userAdd' />
                      </Form.Group>

                      <Button variant="primary" type="submit">Submit</Button>

                    </Form>
                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      );
    }
    else {
      return (
        <Container>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>You are not the owner</Card.Title>
                  <ListGroup>
                    <ListGroup.Item>Your Address: {this.state.acc}</ListGroup.Item>
                    <ListGroup.Item>Owner Is : {this.props.state.owner}</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

export default connect(mapStateToProps)(Upload);