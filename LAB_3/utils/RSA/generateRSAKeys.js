import crypto from 'node:crypto';

export function generateRSAKeys(keySize) {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: keySize,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      }
    );
  });
}
