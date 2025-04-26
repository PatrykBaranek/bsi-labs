export function encryptMessage(messageBits, keyBits) {
  if (messageBits.length !== keyBits.length) {
    throw new Error('Wiadomość i klucz muszą mieć taką samą długość');
  }

  let ciphertext = '';
  for (let i = 0; i < messageBits.length; i++) {
    // Operacja XOR do szyfrowania
    ciphertext += messageBits[i] === keyBits[i] ? '0' : '1';
  }

  return ciphertext;
}

export function decryptMessage(ciphertextBits, keyBits) {
  // Deszyfrowanie jest takie samo jak szyfrowanie w przypadku szyfru opartego na XOR
  return encryptMessage(ciphertextBits, keyBits);
}
