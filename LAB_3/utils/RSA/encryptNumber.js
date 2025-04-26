import crypto from 'node:crypto';

export function encryptNumber(number, publicKey) {
  // Konwersja BigInt na Buffer
  const buffer = Buffer.from(number.toString());

  // Szyfrowanie buffera
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );

  return encryptedBuffer;
}
