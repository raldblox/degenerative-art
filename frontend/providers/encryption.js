"use server";

const CryptoJS = require("crypto-js");

const secretKey = process.env.ENCRYPTION_KEY;

export async function aesEncrypt(data) {
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();

  return ciphertext;
}

export async function aesDecrypt(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
