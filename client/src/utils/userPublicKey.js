import EthCrypto from 'eth-crypto';

const userPublicKey = (add, pk) => {

  try {
    const publicKey = EthCrypto.publicKeyByPrivateKey(
      pk
    );

    const address = EthCrypto.publicKey.toAddress(
      publicKey,
    );

    if (address === add) {

      return { result: true, key: publicKey.toString() };

    }
    else {
      return { result: false, key: 'Wrong Private Key' }
    }
  }
  catch (err) {
    console.log("ERROR", err);
    return { result: false, key: err.toString() }
  }

}

export default userPublicKey;