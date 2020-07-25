// const crypto = require('crypto'), 

import { getHashes, createHash } from 'crypto';

// Returns the names of supported hash algorithms  
// such as SHA1,MD5 
const genHash = (msg) => {

  var hash = getHashes();

  console.log(hash);

  // Create hash of SHA1 type 
  // x = "APPLE";

  // 'digest' is the output of hash function containing  
  // only hexadecimal digits 
  var hashPwd = createHash('sha1').update(msg).digest('hex');

  // console.log(hash);
  // console.log(hashPwd);

  return hashPwd;
}

export default genHash;