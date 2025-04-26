import crypto from 'node:crypto';

export function decryptBuffer(encryptedBuffer, privateKey) {
  // Odszyfrowanie buffera
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    encryptedBuffer
  );

  // Konwersja buffera z powrotem na BigInt
  return BigInt(decryptedBuffer.toString());
}
