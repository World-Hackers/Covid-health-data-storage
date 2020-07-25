import React, { Component } from "react";

import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

import AES from 'crypto-js/aes';
import ipfs from '../../ipfs';

import rsaEncrypt from '../../utils/rsaEncrypt';

import DataCardDoctor from '../cards/DataCardDoctor';

import "../../App.css";

import { connect } from 'react-redux';

class Upload extends Component {

  state = {
    acc: null,
    publicKey: null,
    encrypted: null,
    hash: null,
    files: [],
    balance: 0,
    isDoctor: false,
    allHashes: [],
    decryptForm: false
  };

  async componentDidMount() {
    console.log("PROPS IN UPLOAD", this.props);
    console.log("STATE IN UPLOAD", this.state);

    var inst = this.props.state.contract;
    try {
      let currAccount = await this.props.state.web3.eth.getAccounts();
      let pubKey = await inst.methods.getPublicKey(currAccount.toString()).call({ from: currAccount.toString() });
      let doc = await inst.methods.isDoc(currAccount.toString()).call({ from: currAccount.toString() });


      let allDataHash = await inst.methods.alDoctorsDataHash().call({ from: currAccount.toString() });

      let allData = [];
      for (let i = 0; i < allDataHash.length; i++) {

        let prescriptions = await inst.methods.getDoctorDataDetails(allDataHash[i].toString()).call({ from: currAccount.toString() });
        allData.push(prescriptions);

      }
      this.setState({
        acc: currAccount,
        publicKey: pubKey,
        isDoctor: doc,
        allHashes: allDataHash,
        files: allData,
      })


    } catch (err) {
      console.log("ERROR IN DOCTOR MOUNT", err);
    };
  }

  loadHash() {


    var inst = this.props.state.contract;
    var patient = this.refs.patientAdd.value;
    var patientFile = this.refs.patientFileHash.value;


    this.props.state.web3.eth.getAccounts().then(function (acc) {
      // this.sendReq(acc);
      console.log("ACCOUNT", acc);
      console.log(inst);
      console.log(inst.methods);
      this.setState({ acc: acc })
      console.log("STATE", this.state);
      return inst.methods.sendPrescription(patient.toString(), patientFile.toString(), this.state.hash.toString()).send({ from: this.state.acc.toString() })
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
      // var b = bcrypt.hash(reader.result, salt, function(err, hash){
      //     if(err){
      //         console.log(err);
      //     }
      //     else{
      //         this.setState({bcryptHash: hash});
      //     }
      // })

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


  async addFile2(e) {
    e.preventDefault();
    const patient = this.refs.patientAdd.value.toString();
    const hash = this.refs.patientDataHash.value.toString();
    const prescription = this.refs.prescription.value.toString();

    var inst = this.props.state.contract;

    var file = this.state.files.filter(r => r.hashData.toString() === hash);
    // {

    //   if (r.hashData.toString() === hash) {
    //     console.log("R", r);
    //     console.log("RQUERY", r.query);
    //     return r.query
    //   };
    // })

    console.log("GET FILE", file[0].query);

    try {

      console.log("PUBLIC", this.state.publicKey);

      var prescriptionEncryptDoctor = await rsaEncrypt(this.state.acc.toString(), this.state.publicKey.toString(), prescription);

      console.log("DOC PRES", prescriptionEncryptDoctor);

      if (prescriptionEncryptDoctor.result) {

        var patientPublic = await inst.methods.getPublicKey(patient).call({ from: this.state.acc.toString() });

        console.log("GOT PUBLIC KEY", patientPublic);

        var prescriptionEncryptPatient = await rsaEncrypt(patient, patientPublic.toString(), prescription);
        console.log("PRESCRIPTION ENCRYPT", prescriptionEncryptPatient);
        if (prescriptionEncryptPatient.result) {
          var fileSent = await inst.methods.sendPrescription(patient, hash, prescriptionEncryptDoctor.data.toString(), prescriptionEncryptPatient.data.toString()).send({ from: this.state.acc.toString() });
          console.log(fileSent);
        }
        else {
          alert(`Patient prescription error ${prescriptionEncryptPatient.data}`);
        }
      }
      else {
        alert(`Doctor prescription error ${prescriptionEncryptDoctor.data}`);
      }

    } catch (err) {
      console.log(`Error in sending Prescription`, err);
      alert(`Error in sending Prescription ${err}`);
    }
  }


  

  render() {

    let files = this.state.files;
    console.log("DOC FILES", files);

    console.log("STATE", this.state);
    let thi = this;

    var patientAndFileList = files.length === 0 ? function () {
      console.log(files.length); return (
          <h2>NO DATA</h2>)
    } : files.map(function (file, index) {
      console.log("FILES LENGTH", files.length);
      console.log("FILES", files);
      let data = JSON.parse(file.query).ciphertext;
      let prescription = file.prescription === "" ? "-" : JSON.parse(file.prescription).ciphertext;

      return (
        <DataCardDoctor cardQuery={file.query} cardPrescription={file.prescription} patient={file.patient} hashData={file.hashData} data={data} prescription={prescription} publicKey={thi.state.publicKey.toString()}/>
      )
    });


    if (this.state.acc === null) {
      return (
        <Container>
          <Row>
            <Col>
              Loading...
            </Col>
          </Row>
        </Container>
      )
    }
    else if (this.state.isDoctor === true) {

      return (

        <Container>

          <Row style={{ marginBottom: 15 }}>
{/* 
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Change fee</Card.Title>
                    <Form onSubmit={this.changeFee.bind(this)}>

                      <Form.Group controlId="fee">
                        <Form.Label>Your new fee</Form.Label>
                        <Form.Control type="text" placeholder="Enter your fee amount" ref='doctorNewFee' />
                      </Form.Group>

                      <Button variant="primary" type="submit">Submit</Button>

                    </Form>
                </Card.Body>
              </Card>
            </Col> */}

          </Row>

          <Row style={{ marginBottom: 15 }}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Add Prescription for the patient</Card.Title>
                    <Form onSubmit={this.addFile2.bind(this)}>

                      <Form.Group controlId="addressPat">
                        <Form.Label>Patient's Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Patient's Address" ref='patientAdd' />
                      </Form.Group>

                      <Form.Group controlId="patientFile">
                        <Form.Label>Patient's Data Hash</Form.Label>
                        <Form.Control type="text" placeholder="Enter File Hash" ref='patientDataHash' />
                      </Form.Group>

                      <Form.Group controlId="prescription">
                        <Form.Label>Prescription</Form.Label>
                        <Form.Control type="text" placeholder="Enter File Hash" ref='prescription' />
                      </Form.Group>

                      <Button variant="primary" type="submit">Submit</Button>

                    </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* <Row style={{ marginBottom: 15 }}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Add Prescription for the patient</Card.Title>
                    <Form onSubmit={this.addFile.bind(this)}>

                      <Form.Group controlId="addressPat">
                        <Form.Label>Patient's Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Patient's Address" ref='patientAdd' />
                      </Form.Group>

                      <Form.Group controlId="patientFile">
                        <Form.Label>Patient's File Hash</Form.Label>
                        <Form.Control type="text" placeholder="Enter File Hash" ref='patientFileHash' />
                      </Form.Group>

                      <a className="button browse blue">Browse  </a>
                      <input
                        type='file' label='Upload' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf, application/docx" ref='fileUpload'
                      />

                      <Button variant="primary" type="submit">Submit</Button>

                    </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}

          <Row style={{ marginBottom: 15 }}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>List All Files</Card.Title>
                    <Row>
                      
                      {patientAndFileList}
                    </Row>
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
                  <Card.Title>You are not a Doctor</Card.Title>
                    <ListGroup>
                      <ListGroup.Item>Your Address: {this.state.acc}</ListGroup.Item>
                      <ListGroup.Item>Owner Address: {this.props.state.owner}</ListGroup.Item>
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