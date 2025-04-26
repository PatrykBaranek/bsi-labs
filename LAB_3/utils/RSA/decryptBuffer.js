/**
 * Funkcja do szybkiego potęgowania modulo
 * @param {bigint} base - podstawa
 * @param {bigint} exponent - wykładnik
 * @param {bigint} modulus - moduł
 * @returns {bigint} wynik (base^exponent) mod modulus
 */
function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;

  let result = 1n;
  base = base % modulus;

  while (exponent > 0n) {
    // Jeśli wykładnik jest nieparzysty
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }

    // Dzielimy wykładnik przez 2
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }

  return result;
}

/**
 * Konwertuje liczbę na BigInt (jeśli jeszcze nie jest)
 * @param {number|bigint|string} number - liczba do konwersji
 * @returns {bigint} liczba jako BigInt
 */
function toBigInt(number) {
  return BigInt(number);
}

/**
 * Konwertuje BigInt na Buffer
 * @param {bigint} number - liczba do konwersji
 * @returns {Buffer} liczba jako Buffer
 */
function bigIntToBuffer(number) {
  // Konwersja BigInt na hex string
  let hex = number.toString(16);

  // Upewniamy się, że hex ma parzystą liczbę znaków
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  // Tworzenie buffera z hex stringa
  return Buffer.from(hex, 'hex');
}

/**
 * Konwertuje Buffer na BigInt
 * @param {Buffer} buffer - buffer do konwersji
 * @returns {bigint} buffer jako BigInt
 */
function bufferToBigInt(buffer) {
  // Konwersja buffera na hex string, a następnie na BigInt
  const hex = buffer.toString('hex');
  return hex === '' ? 0n : BigInt('0x' + hex);
}

/**
 * Odszyfrowuje zaszyfrowany buffer używając algorytmu RSA
 * @param {Buffer|bigint} encryptedBuffer - zaszyfrowany buffer lub liczba
 * @param {object} privateKey - klucz prywatny zawierający n i d
 * @returns {bigint} odszyfrowana liczba jako BigInt
 */
export function decryptBuffer(encryptedBuffer, privateKey) {
  // Konwersja wejściowego buffera/liczby na BigInt
  let c;
  if (Buffer.isBuffer(encryptedBuffer)) {
    c = bufferToBigInt(encryptedBuffer);
  } else {
    c = toBigInt(encryptedBuffer);
  }

  // Wyciągnięcie składników klucza prywatnego (n, d)
  // Zakładamy, że privateKey to obiekt z polami n i d jako BigInt
  const n = toBigInt(privateKey.n);
  const d = toBigInt(privateKey.d);

  // Sprawdzenie czy zaszyfrowana wiadomość nie jest większa niż moduł
  if (c >= n) {
    throw new Error('Zaszyfrowana wiadomość jest zbyt duża dla tego klucza RSA');
  }

  // Odszyfrowanie RSA: m = c^d mod n
  const decryptedNumber = modPow(c, d, n);

  return decryptedNumber;
}