// // const EthCrypto = require('eth-crypto');
// import EthCrypto from 'eth-crypto';
// // create identitiy with key-pairs and address
// const alice = EthCrypto.createIdentity();

// console.log(alice);

// const secretMessage = 'My name is Satoshi Buterin';

// const rsaEncrypt = () => {

//   setTimeout(async () => {

//     try {
//       const publicKey = EthCrypto.publicKeyByPrivateKey(
//         'd5797f17a2be6ea0ac5086651a68b8913fab126bacabbd7fe08f0a1c8bf339e6'
//       );
//       console.log(publicKey);

//       const encrypted = await EthCrypto.encryptWithPublicKey(
//         "d5797f17a2be6ea0ac5086651a68b8913fab126bacabbd7fe08f0a1c8bf339e6",
//         secretMessage
//       );

//       console.log(encrypted);

//       const decrypted = await EthCrypto.decryptWithPrivateKey(
//         publicKey,
//         encrypted
//       );

//       if (decrypted === secretMessage) console.log('success');
//     }
//     catch (err) {
//       console.log("ERROR", err);
//     }

//   }, 1000);


// }
// export default rsaEncrypt;


import EthCrypto from 'eth-crypto';

const rsaEncrypt = async (add, pk, message) => {

  try {
    const publicKey = EthCrypto.publicKeyByPrivateKey(
      pk
    );

    const address = EthCrypto.publicKey.toAddress(
      publicKey,
    );

    if (address === add) {
      const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey,
        message
      );

      return { result: true, data: JSON.stringify(encrypted) };
    }
    else {
      return { result: false, data: 'Wrong Private Key' }
    }
  }
  catch (err) {
    console.log("ERROR", err);
    return { result: false, data: err.toString() }
  }

}

export default rsaEncrypt;