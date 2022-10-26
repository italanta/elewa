const CryptoJS = require("crypto-js");

/**
 * @Description Function to do encoding
 * @param stringToEncode 
 * @param passphrase whose default value is 'conv'
 * @returns encrypted string
 */
export function __ENCODE_AES(stringToEncode:string, passphrase:string = 'conv'){
  const encrypted =  CryptoJS.AES.encrypt(stringToEncode, passphrase);
  return encrypted.toString();
}

/**
 * @Description Function to do decoding
 * @param stringToDecode 
 * @param passphrase whose default value is 'conv'
 * @returns decrypted string
 */
export function __DECODE_AES(stringToDecode:string,  passphrase:string = 'conv'){​
  const decrypted =  CryptoJS.AES.decrypt(stringToDecode,  passphrase);
  return decrypted.toString(CryptoJS.enc.Utf8);
}