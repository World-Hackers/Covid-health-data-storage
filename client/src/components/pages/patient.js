import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

import AES from 'crypto-js/aes';
import ipfs from '../../ipfs';

import rsaDecrypt from '../../utils/rsaDecrypt';
import rsaEncrypt from '../../utils/rsaEncrypt';
import genHash from '../../utils/genHash';

import DataCardPatient from '../cards/DataCardPatient';

import "../../App.css";

import { connect } from 'react-redux';

class Upload extends Component {

  state = {
    acc: null,
    publicKey: null,
    encrypted: null,
    generatedHash: null,
    hash: null,
    files: [],
    prescriptions: [],
    balance: 0,
    isPatient: false,
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
      let pat = await inst.methods.isPatient(currAccount.toString()).call({ from: currAccount.toString() });

      let allDataHash = await inst.methods.allPatientsDataHash().call({ from: currAccount.toString() });

      let allData = [];
      for (let i = 0; i < allDataHash.length; i++) {

        let prescriptions = await inst.methods.getPatientDataDetails(allDataHash[i].toString()).call({ from: currAccount.toString() });
        allData.push(prescriptions);

      }
      this.setState({
        acc: currAccount,
        publicKey: pubKey,
        isPatient: pat,
        allHashes: allDataHash,
        files: allData,
      })


    } catch (err) {
      console.log("ERROR IN PATIENT MOUNT", err);
    }
  }


  async generateHash(e) {
    e.preventDefault();
    // const pk = this.refs.encryptPK.value;
    const msg = this.refs.encryptMessage.value;
    var res = await genHash(msg);
    console.log("RES IN ENCRYPT", res);
    this.setState({
      generatedHash: res.toString(),
    })
  }

  async encrypt(e) {
    e.preventDefault();
    const pk = this.refs.encryptPK.value;
    const msg = this.refs.encryptMessage.value;
    var res = await rsaEncrypt(this.state.acc.toString(), pk, msg);
    console.log("RES IN ENCRYPT", res);
    this.setState({
      completeEncrypt: res.toString(),
      encryptedMessage: res.data.toString(),
    })
  }

  async decrypt(e) {
    e.preventDefault();
    const pk = this.refs.decryptPK.value;

    var res = await rsaDecrypt(this.state.acc.toString(), pk, this.state.encryptedMessage);
    console.log("RES IN ENCRYPT", res);
    this.setState({
      completeDecrypt: res.toString(),
      decryptedMessage: res.data.toString(),
    })
  }



  loadHash() {


    var inst = this.props.state.contract;


    this.props.state.web3.eth.getAccounts().then(function (acc) {
      // this.sendReq(acc);
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
    }, 5000);
  }

  addFile(e) {
    e.preventDefault();
    const file = this.refs.fileUpload.files[0];
    console.log(file, "\n\n");
    this.encryptFile(file);
  }

  async addFile2(e) {
    e.preventDefault();

    const file = this.refs.patientQuery.value;
    console.log(file, "\n\n");

    var inst = this.props.state.contract;

    var acc = this.state.acc.toString();
    var publicKey = this.state.publicKey.toString();
    // await inst.methods.getPublicKey(acc).call({ from: acc });
    var uniqueHash = await genHash(file);
    console.log("GENERATED HASH", uniqueHash);
    var encrypt = await rsaEncrypt(acc, publicKey, file);
    console.log("RES IN ENCRYPT", encrypt);

    if (encrypt.result) {

      // console.log("STATE IN UPLOAD", this.state);
      try {
        var res = await inst.methods.addFile(uniqueHash.toString(), encrypt.data.toString()).send({ from: acc });
        console.log("After Call", res);
      }
      catch (err) {
        console.log("Error", err);
      }

    }

    else {
      alert(encrypt.data.toString());
    }


    // this.setState({
    //   completeEncrypt: res.toString(),
    //   encryptedMessage: res.data.toString(),
    // })

  }

  async sendFile(e) {
    e.preventDefault();

    const fileHash = this.refs.fileHash.value.toString();
    const doctor = this.refs.docAdd.value.toString();
    const userPrivate = this.refs.userPk.value.toString();

    var inst = this.props.state.contract;

    console.log("IN SEND FILE");

    var file = this.state.files.filter(r => r.hashData.toString() === fileHash);
    //   {

    //   if (r.hashData.toString() === fileHash) {
    //     console.log("R", r);
    //     console.log("RQUERY", r.query);
    //     return r.query
    //   };
    // })

    console.log("GET FILE", file[0].query);
    // setTimeout(async () => {
    try {
      var decrypted = await rsaDecrypt(this.state.publicKey.toString(), userPrivate, file[0].query);

      if (decrypted.result) {

        console.log("DECRYPTED DATA", decrypted.data);

        var doctorPublic = await inst.methods.getPublicKey(doctor).call({ from: this.state.acc.toString() });

        var encrypted = await rsaEncrypt(doctor, doctorPublic.toString(), decrypted.data);

        if (encrypted.result) {
          console.log("ENCRYPTED DATA", encrypted.data);

          try {

            var fileSent = await inst.methods.sendFile(doctor, fileHash, encrypted.data).send({ from: this.state.acc.toString() })

            console.log("After Call", fileSent);
          }
          catch (err) {
            console.log("Error IN FILE SEND", err);
          }
        }
        else {
          alert(encrypted.data);
        }
      }
      else {
        alert(decrypted.data);
      }
    } catch (err) {
      console.log("ERROR in SEND FUNCTINO", err);
      alert("FUNCTINO NOT CALLED");
    }

    //   // rsaDecrypt
    //   // rsaEncrypt
    // }, 100);



    // this.props.state.web3.eth.getAccounts().then(function (acc) {
    //   // this.sendReq(acc);
    //   console.log("ACCOUNT", acc);
    //   console.log(inst);
    //   console.log(inst.methods);
    //   this.setState({ acc: acc })
    //   console.log("STATE", this.state);
    //   return inst.methods.docFee(doctor.toString()).call({ from: this.state.acc.toString() });
    // }.bind(this)).then(function (fee) {
    //   console.log("FEE", fee);
    //   return inst.methods.sendFile(doctor.toString(), file.toString(), fee).send({ from: this.state.acc.toString() })
    // }.bind(this)).then(function (res) {
    //   console.log("AFTER FUNCTION", res)
    // }).catch(function (err) {
    //   console.log("ERROR", err);
    // })
  }

  changeDecrypt(e) {
    e.preventDefault();
    this.setState({ decryptForm: true })
  }

  decryptFormHandle(e) {
    e.preventDefault();
    this.setState({ decryptForm: false })
  }

  render() {

    var files = this.state.files;

    console.log("FILEs", files);
    if (files.length) {
      console.log("FILEs", files[0]);
      console.log("FILEs", files[0].doctor);
      console.log("FILEs", files[0].hashData);
      console.log("FILEs", files[0].prescription);
      console.log("FILEs", files[0].query);
      console.log("FILEs", JSON.parse(files[0].query));
      console.log("FILEs", JSON.parse(files[0].query).ciphertext);
    }

    let thi = this

    var fileList = files.length === 0 ? function () {
      console.log(files.length); return (
        <h1>NO DATA</h1>)
    } : files.map(function (file, index) {
      console.log("FILES LENGTH", files.length);
      console.log("FILES", files);
      let data = JSON.parse(file.query).ciphertext;
      let doc = file.doctor.toString() === '0x0000000000000000000000000000000000000000' ? '-' : file.doctor.toString();
      let prescription = file.prescription === "" ? "-" : JSON.parse(file.prescription).ciphertext;


      return (

        <DataCardPatient cardQuery={file.query} cardPrescription={file.prescription} doctor={doc} hashData={file.hashData} data={data} prescription={prescription} publicKey={thi.state.publicKey.toString()} />
      )
    });

    var balance = this.state.balance;

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
    else if (this.state.isPatient === true) {

      return (

        <Container>

          <Row style={{ marginBottom: 15 }}>

            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>ADD Data file in Excel</Card.Title>
                    <Form onSubmit={this.addFile2.bind(this)}>
                      <Form.Group controlId="addressPat">
                        <Form.Label>Your Query</Form.Label>
                        <Form.Control type="text" placeholder="Enter your query" ref='patientQuery' />
                      </Form.Group>

                      <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* <Col>
              <Card>
                <Card.Body>
                  <Card.Title>ADD Data file in Excel</Card.Title>
                    <Form onSubmit={this.addFile.bind(this)}>
                      <a className="button browse blue">Browse     </a>
                      <input
                        type='file' label='Upload' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf, application/docx" ref='fileUpload'
                      />
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
                  <Card.Title>List All Files</Card.Title>
                    <Row>
                      {fileList}
                    </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row style={{ marginBottom: 15 }}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Send File to doctor</Card.Title>
                    <Form onSubmit={this.sendFile.bind(this)}>

                      <Form.Group controlId="fileHash">
                        <Form.Label>File Hash from above</Form.Label>
                        <Form.Control type="text" placeholder="Enter Hospital name" ref='fileHash' />
                      </Form.Group>

                      <Form.Group controlId="addressDoc">
                        <Form.Label>Doctor's Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Doctor's Address" ref='docAdd' />
                      </Form.Group>

                      <Form.Group controlId="addressDoc">
                        <Form.Label>Your Private Key</Form.Label>
                        <Form.Control type="text" placeholder="Enter your private key" ref='userPk' />
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
                  <Card.Title>You are not a patient</Card.Title>
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