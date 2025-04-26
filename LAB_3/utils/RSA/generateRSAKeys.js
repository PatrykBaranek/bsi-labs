/**
 * Funkcja obliczająca największy wspólny dzielnik (NWD) dwóch liczb
 * @param {number} a - Pierwsza liczba
 * @param {number} b - Druga liczba
 * @return {number} Największy wspólny dzielnik
 */
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b]; // Algorytm Euklidesa
  }
  return a;
}

/**
 * Funkcja obliczająca odwrotność modularną
 * @param {number} e - Liczba, dla której szukamy odwrotności
 * @param {number} phi - Moduł
 * @return {number} Odwrotność modularna liczby e modulo phi
 */
function modInverse(e, phi) {
  let [m0, x0, x1] = [phi, 0, 1];
  while (e > 1) {
    let q = Math.floor(e / phi);
    [e, phi] = [phi, e % phi];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0 ? x1 + m0 : x1; // Zapewnienie dodatniego wyniku
}

/**
 * Funkcja sprawdzająca czy liczba jest pierwsza
 * @param {number} num - Liczba do sprawdzenia
 * @return {boolean} Prawda jeśli liczba jest pierwsza, fałsz w przeciwnym przypadku
 */
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false; // Jeśli jest podzielna, to nie jest pierwsza
  }
  return true;
}

/**
 * Funkcja generująca losową liczbę pierwszą z danego zakresu
 * @param {number} min - Dolna granica zakresu
 * @param {number} max - Górna granica zakresu
 * @return {number} Wygenerowana liczba pierwsza
 */
function generatePrime(min, max) {
  let prime = 0;
  while (!isPrime(prime)) {
    prime = Math.floor(Math.random() * (max - min)) + min; // Losowa liczba z zakresu
  }
  return prime;
}

/**
 * Funkcja generująca parę kluczy RSA
 * @param {number} keySize - Rozmiar klucza w bitach (domyślnie 16)
 * @return {Object} Obiekt zawierający klucz publiczny i prywatny
 */
export function generateRSAKeys(keySize = 16) {
  // Określamy zakres dla liczb pierwszych
  const min = 2 ** (keySize / 2 - 1);
  const max = 2 ** (keySize / 2) - 1;

  // Generujemy dwie różne liczby pierwsze
  let p = generatePrime(min, max);
  let q = generatePrime(min, max);
  while (q === p) q = generatePrime(min, max); // Upewniamy się, że p i q są różne

  const n = p * q; // Obliczamy n - iloczyn liczb pierwszych
  const phi = (p - 1) * (q - 1); // Funkcja Eulera

  // Wybieramy wykładnik publiczny e (względnie pierwszy z phi)
  let e = 3;
  while (gcd(e, phi) !== 1) e += 2; // Szukamy liczby względnie pierwszej z phi

  // Obliczamy wykładnik prywatny d (odwrotność modularna e modulo phi)
  const d = modInverse(e, phi);

  // Zwracamy parę kluczy
  return {
    publicKey: { e, n }, // Klucz publiczny
    privateKey: { d, n }, // Klucz prywatny
  };
}