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
 * Szyfruje liczbę używając algorytmu RSA
 * @param {number|bigint|string} number - liczba do zaszyfrowania
 * @param {object} publicKey - klucz publiczny zawierający n i e
 * @returns {bigint} zaszyfrowana liczba
 */
export function encryptNumber(number, publicKey) {
  // Konwersja wejściowej liczby na BigInt
  const m = toBigInt(number);

  // Wyciągnięcie składników klucza publicznego (n, e)
  // Zakładamy, że publicKey to obiekt z polami n i e jako BigInt
  const n = toBigInt(publicKey.n);
  const e = toBigInt(publicKey.e);

  // Sprawdzenie czy wiadomość nie jest większa niż moduł
  if (m >= n) {
    throw new Error('Wiadomość jest zbyt duża dla tego klucza RSA');
  }

  // Szyfrowanie RSA: c = m^e mod n
  const encryptedNumber = modPow(m, e, n);

  return encryptedNumber;
}