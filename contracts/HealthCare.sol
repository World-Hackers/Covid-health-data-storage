pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;


contract HealthCare {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    struct DATA {
        string file;
        string prescription;
    }

    // data hashes as seen by patients
    struct PatientData {
        string hashData;
        string query;
        address doctor;
        string prescription;
    }

    // data hashes as seen by Doctors
    struct DoctorData {
        address patient;
        string hashData;
        string query;
        string prescription;
    }

    mapping(address => bool) public isDoc; // doctor
    address[] public allDoctors;

    mapping(address => bool) public isPatient; // patient
    address[] public allPatients;

    mapping(address => uint256) public docFee; // doctor while registering doctor


    // patient's variables
    mapping(address => string[]) public patientAllDataHash; // patient addFileUniqueHash
    mapping(string => PatientData) public patientDataDetails;
    mapping(address => mapping(string => bool)) public patientDataCheckHash; // patient addFileUniqueHash


    // doctor's variables
    mapping(address => string[]) public doctorReceivedDataHash;
    mapping(string => DoctorData) public doctorDataDetails;
    mapping(address => mapping(string => bool)) public doctorDataCheckHash; // patient addFileUniqueHash

    // addresses to public key
    mapping(address => string) public addToPublic;


    // <-------START EVENTS------->

    // when user is registered he will enter his public key
    event PublicKey(address User, string PublicKey);

    // when patient is added
    event PatientAdded(address Patient);

    // when doctor is added
    event DoctorAdded(address Doctor);

    // when doctor changes his fee
    event FeeChanged(address Doctor, uint256 Fee);

    // wehen patient adds new file (data)
    event PatientDataAdded(address Patient, string FileHash, string FileData);

    // <-------END EVENTS------->

    // <-------GETTING PUBLIC KEY------->

    function getPublicKey(address _add) public view returns (string memory) {
        return addToPublic[_add];
    }

    // <-------START PATIENT FUNCTIONS------->

    // // SETTERS

    // registering patient
    function addPatient(string memory _publicKey) public {
        // msg.sender is patient
        require(isDoc[msg.sender] == false, "Address is Doctor");
        require(isPatient[msg.sender] == false, "Address is already patient");

        isPatient[msg.sender] = true;
        allPatients.push(msg.sender);

        addToPublic[msg.sender] = _publicKey;

        emit PatientAdded(msg.sender);
        emit PublicKey(msg.sender, _publicKey);
    }

    function addFile(string memory _fileHash, string memory _fileDataEncrypt)
        public
    {
        // msg.sender is patient
        require(isPatient[msg.sender] == true, "Address is not patient");
        require(patientDataCheckHash[msg.sender][_fileHash] == false, "File already added");

        patientAllDataHash[msg.sender].push(_fileHash);

        patientDataDetails[_fileHash].hashData = _fileHash;
        patientDataDetails[_fileHash].query = _fileDataEncrypt;
        patientDataCheckHash[msg.sender][_fileHash] = true;

        emit PatientDataAdded(msg.sender, _fileHash, _fileDataEncrypt);
    }

    function sendFile(
        address _doc,
        string memory _fileHash,
        string memory _fileDataEncrypt
    ) public {
        // msg.sender is patient
        require(isPatient[msg.sender] == true, "You are not patient");
        require(isDoc[_doc] == true, "Invalid Doctor");
        require(patientDataCheckHash[msg.sender][_fileHash] == true, "Invalid data");
        require(doctorDataCheckHash[_doc][_fileHash] == false, "File already sent");

        doctorReceivedDataHash[_doc].push(_fileHash);
        doctorDataCheckHash[_doc][_fileHash] = true;

        doctorDataDetails[_fileHash].patient = msg.sender;
        doctorDataDetails[_fileHash].hashData = _fileHash;
        doctorDataDetails[_fileHash].query = _fileDataEncrypt;

        patientDataDetails[_fileHash].doctor = _doc;

    }

    // // GETTERS

    function getAllPatients() public view returns (address[] memory) {
        return allPatients;
    }


    function allPatientsDataHash() public view returns (string[] memory) {
        return patientAllDataHash[msg.sender];
    }

    function getPatientDataDetails(string memory _hash) public view returns(PatientData memory _res){
        require(patientDataCheckHash[msg.sender][_hash] == true, "Invalid data");
        return patientDataDetails[_hash];
    }

    // <-------END PATIENT FUNCTIONS------->

    // <-------START DOCTOR FUNCTIONS------->

    // // SETTERS

    function addDoctor(string memory _publicKey) public {
        // msg.sender is doctor
        require(isDoc[msg.sender] == false, "Address is already Doctor");
        require(isPatient[msg.sender] == false, "Address is patient");

        allDoctors.push(msg.sender);
        isDoc[msg.sender] = true;

        addToPublic[msg.sender] = _publicKey;
        emit DoctorAdded(msg.sender);
        emit PublicKey(msg.sender, _publicKey);
    }

    function sendPrescription(
        address _patient,
        string memory _filehash,
        string memory _prescriptionDoctor,
        string memory _prescriptionPatient
    ) public {
        // msg.sender is doctor
        require(isDoc[msg.sender] == true, "You are not Doctor");
        require(isPatient[_patient] == true, "Invalid patient");
        require(doctorDataCheckHash[msg.sender][_filehash] == true, "File not available");
        require(patientDataCheckHash[_patient][_filehash] == true, "Invalid data hash");
        require(doctorDataDetails[_filehash].patient == _patient, "Patient not valid");
        require(patientDataDetails[_filehash].doctor == msg.sender, "Doctor not authorized");
        require(keccak256(abi.encodePacked(doctorDataDetails[_filehash].prescription)) == keccak256(abi.encodePacked("")),
        "Prescription already added in doctor.");
        require(keccak256(abi.encodePacked(patientDataDetails[_filehash].prescription)) == keccak256(abi.encodePacked("")),
        "Prescription already added in patient.");

        doctorDataDetails[_filehash].prescription = _prescriptionDoctor;

        patientDataDetails[_filehash].prescription = _prescriptionPatient;

    }

    // GETTERS

    function getAllDoctors() public view returns (address[] memory) {
        return allDoctors;
    }

    function alDoctorsDataHash() public view returns (string[] memory) {
        return doctorReceivedDataHash[msg.sender];
    }

    function getDoctorDataDetails(string memory _hash) public view returns(DoctorData memory _res){
        require(doctorDataCheckHash[msg.sender][_hash] == true, "Invalid data");
        return doctorDataDetails[_hash];
    }

    // <-------END DOCTOR FUNCTIONS------->
}