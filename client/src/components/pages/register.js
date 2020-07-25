import React, { Component } from "react";
// import SimpleStorageContract from "../contracts/SimpleStorage.json";
// import getWeb3 from "../getWeb3";
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

import "../../App.css";


import { connect } from 'react-redux';

import userPublicKey from '../../utils/userPublicKey';


//Admin will register Doctor using this component

class RegisterDoctor extends Component {

  state = {
    hospital: ""
  }

  componentDidMount() {
    console.log("PROPS IN REGISTER", this.props);
    console.log("STATE IN REGISTER", this.props.state);

    var account = this.props.state.account;

    console.log("User account", account);
  }

  // show() {
  //     const data = [{
  //         name: findDOMNode(this.refs.fullName).value,
  //         email: findDOMNode(this.refs.userEmail).value,
  //         userType: findDOMNode(this.refs.user).value
  //     }]

  //     console.log(data);
  //     findDOMNode(this.refs.user).value = undefined
  // }

  // changeUser(str) {
  //     findDOMNode(this.refs.user).value = str;
  // }

  // addHosp(e) {
  //     e.preventDefault();
  //     var hosp = findDOMNode(this.refs.hospName).value;
  //     console.log(hosp);

  //     var inst = this.props.state.contract;

  //     // await contract.methods.set(5).send({ from: accounts[0] });

  //     // await contract.methods.addHospital("mmm").send({ from: accounts[0] });


  //     this.props.state.web3.eth.getAccounts().then(function (acc) {
  //         // this.sendReq(acc);
  //         console.log("ACCOUNT", acc);
  //         console.log(inst);
  //         console.log(inst.methods);
  //         return inst.methods.addYourHosp(hosp.toString()).send({ from: acc.toString() });
  //     }).then(function (res) {
  //         console.log("AFTER FUNCTION", res)
  //     }).catch(function (err) {
  //         console.log(err);
  //     })
  // }

  // addDoctor(e) {
  //     e.preventDefault();

  //     var add = findDOMNode(this.refs.docAdd).value;
  //     var name = findDOMNode(this.refs.docName).value;
  //     var email = findDOMNode(this.refs.docEmail).value;
  //     console.log(add);
  //     console.log(name);
  //     console.log(email);

  //     var inst = this.props.state.contract;

  //     // await contract.methods.set(5).send({ from: accounts[0] });

  //     // await contract.methods.addHospital("mmm").send({ from: accounts[0] });

  //     var currentAcc;

  //     this.props.state.web3.eth.getAccounts().then(function (acc) {
  //         // this.sendReq(acc);
  //         console.log("ACCOUNT", acc);
  //         console.log(inst);
  //         console.log(inst.methods);
  //         currentAcc = acc
  //         return inst.methods.adminHosp(acc.toString()).call()
  //     }).then(function (hosp) {
  //         console.log("GET HOSPITAL", hosp);
  //         return inst.methods.addDoctor(add.toString(), name.toString(), email.toString(), hosp.toString()).send({ from: currentAcc.toString() })
  //     }).then(function (res) {
  //         console.log("AFTER FUNCTION", res)
  //     }).catch(function (err) {
  //         console.log(err);
  //     })
  // }

  // shareHospData(e) {
  //     e.preventDefault();
  //     var toHosp = findDOMNode(this.refs.shareHosp).value;
  //     console.log(toHosp);

  //     var inst = this.props.state.contract;
  //     var currentAcc;

  //     this.props.state.web3.eth.getAccounts().then(function (acc) {
  //         // this.sendReq(acc);
  //         console.log("ACCOUNT", acc);
  //         console.log(inst);
  //         console.log(inst.methods);
  //         currentAcc = acc;
  //         return inst.methods.adminHosp(acc.toString()).call()
  //     }).then(function (fromHosp) {
  //         return inst.methods.shareHospData(fromHosp.toString(), toHosp.toString()).send({ from: currentAcc.toString() })
  //     }).then(function (res) {
  //         console.log("AFTER FUNCTION", res)
  //     }).catch(function (err) {
  //         console.log(err);
  //     })

  // }



  registerPatient(e) {
    e.preventDefault();
    console.log("REGISTERING");

    var inst = this.props.state.contract;
    var Web3 = this.props.state.web3;

    var secret = this.refs.patientPK.value;

    setTimeout(async () => {
      var currentAcc = await Web3.eth.getAccounts();
      
      console.log("currentAcc", currentAcc.toString());

      var publicKey = userPublicKey(currentAcc.toString(), secret);

      console.log("PUBLIC OBJ", publicKey);

      if (publicKey.result) {

        var patientAdded = await inst.methods.addPatient(publicKey.key).send({ from: currentAcc.toString() });
        console.log(patientAdded.events.PatientAdded.event);
        console.log(patientAdded.events.PatientAdded.returnValues.Patient);
      }
      else {
        alert(publicKey.key.toString());
      }
    }, 100);

    // this.props.state.web3.eth.getAccounts().then(function (acc) {
    //   // this.sendReq(acc);
    //   console.log("ACCOUNT", acc);
    //   console.log(inst);
    //   console.log(inst.methods);
    //   currentAcc = acc;
    //   return inst.methods.addPatient().send({ from: currentAcc.toString() })
    // }).then(function (added) {
    //   // console.log(added)
    //   console.log(added.events.PatientAdded.event)
    //   console.log(added.events.PatientAdded.returnValues.Patient)
    // })
  }

  registerDoctor(e) {
    e.preventDefault();
    console.log("REGISTERING");

    var inst = this.props.state.contract;
    var secret = this.refs.doctorPK.value;
    var Web3 = this.props.state.web3;

    setTimeout(async () => {
      var currentAcc = await Web3.eth.getAccounts();
console.log(currentAcc);
      console.log("currentAcc", currentAcc.toString());
      var publicKey = userPublicKey(currentAcc.toString(), secret);

      console.log("PUBLIC OBJ", publicKey);

      if (publicKey.result) {

        var doctorAdded = await inst.methods.addDoctor(publicKey.key.toString()).send({ from: currentAcc.toString() })
        console.log(doctorAdded);
        console.log(doctorAdded);
      }
      else {
        alert(publicKey.key.toString());
      }
    }, 100);


    // this.props.state.web3.eth.getAccounts().then(function (acc) {
    //   // this.sendReq(acc);
    //   console.log("ACCOUNT", acc);
    //   console.log(inst);
    //   console.log(inst.methods);
    //   currentAcc = acc;
    //   return inst.methods.addDoctor(fee).send({ from: currentAcc.toString() })
    // }).then(function (added) {
    //   console.log(added.events.DoctorAdded.event)
    //   console.log(added.events.DoctorAdded.returnValues.Doctor);
    //   // assert.equal(added.logs[0].event, "DoctorAdded");
    // })
  }

  render() {

    return (

      <Container>

        <Row>
          <Col md={{ span: 6, offset: 3 }} style={{ marginBottom: 15 }}>
            <Card>
              <Card.Body>
                <Card.Title>Register Patient</Card.Title>
                  <Form onSubmit={this.registerPatient.bind(this)}>

                    <Form.Group controlId="docAddress">
                      <Form.Label>Your Private Key</Form.Label>
                      <Form.Control type="password" placeholder="Enter your private key" ref='patientPK' />

                    </Form.Group>


                    <Button variant="primary" type="submit">Register as Patient</Button>

                  </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Card>
              <Card.Body>
                <Card.Title>Register Doctor</Card.Title>
                  <Form onSubmit={this.registerDoctor.bind(this)}>

                    {/* <Form.Group controlId="docAddress">
                      <Form.Label>Fees paid by patients</Form.Label>
                      <Form.Control type="number" placeholder="Enter your charges" ref='docFee' />
                      <small>At time of such pendemic, we encourage you to provide free services. You can always change your fees later.</small>
                    </Form.Group> */}
                    <Form.Group controlId="docAddress">
                      <Form.Label>Your Private Key</Form.Label>
                      <Form.Control type="password" placeholder="Enter your private key" ref='doctorPK' />

                    </Form.Group>

                    <Button variant="primary" type="submit">Register as Doctor</Button>

                  </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>

      // <div style={{ marginLeft: "10px", paddingRight: "50px" }}>

      //   <div>
      //     <h2>Register Patient</h2>
      //     <Button variant="primary" onClick={this.registerPatient.bind(this)}>Register Patient</Button>

      //     <h2>Register Doctor</h2>
      //     <Form onSubmit={this.registerDoctor.bind(this)}>

      //       <Form.Group controlId="docAddress">
      //         <Form.Label>Fees paid by patients</Form.Label>
      //         <Form.Control type="number" placeholder="Enter your charges" ref='docFee' />
      //         <small>At time of such pendemic, we encourage you to provide free services. You can always change your fees later.</small>
      //       </Form.Group>


      //       <Button variant="primary" type="submit">Submit</Button>

      //     </Form>
      //   </div>
      // </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

export default connect(mapStateToProps)(RegisterDoctor);