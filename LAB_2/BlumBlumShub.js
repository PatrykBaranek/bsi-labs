import crypto from 'node:crypto';

export class BlumBlumShub {
  constructor() {
    // Generowanie odpowiednich liczb pierwszych p i q (obie ≡ 3 mod 4)
    this.p = this.generateSuitablePrime();
    this.q = this.generateSuitablePrime();

    // Upewnienie się, że p i q są różne
    while (this.p === this.q) {
      this.q = this.generateSuitablePrime();
    }

    // Obliczenie n = p * q
    this.n = this.p * this.q;

    // Wybór losowego ziarna s, które jest względnie pierwsze z n
    this.seed = this.generateSeed();

    // Inicjalizacja x0
    this.x = this.seed;
  }

  generateSuitablePrime() {
    // Generowanie liczby pierwszej p, gdzie p ≡ 3 (mod 4)
    let candidate;
    do {
      // Generowanie losowej liczby pierwszej o rozsądnym rozmiarze
      candidate = this.generatePrime(32); // 32 bitów dla prostoty
    } while (candidate % 4 !== 3);

    return candidate;
  }

  generatePrime(bits) {
    // Dla uproszczenia używamy Node.js crypto do generowania liczb pierwszych
    const buffer = crypto.randomBytes(Math.ceil(bits / 8));
    // Ustawienie najwyższego bitu, aby wartość była odpowiedniego rozmiaru
    buffer[0] = buffer[0] | 128;
    const randomNum = parseInt(buffer.toString('hex'), 16) % 10000;

    // Uproszczone sprawdzenie: szukamy liczby pierwszej w pobliżu wygenerowanej
    return this.findNextPrime(randomNum);
  }

  findNextPrime(start) {
    let num = start;

    while (!this.isPrime(num)) {
      num++;
    }

    return num;
  }

  isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  generateSeed() {
    // Generowanie losowego ziarna, które jest względnie pierwsze z n
    let s;
    do {
      s = Math.floor(Math.random() * (this.n - 3)) + 2;
    } while (this.gcd(s, this.n) !== 1);

    return s;
  }

  // Obliczanie największego wspólnego dzielnika (NWD) dwóch liczb
  gcd(a, b) {
    if (b === 0) return a;
    return this.gcd(b, a % b);
  }

  // Generowanie kolejnego bitu
  nextBit() {
    // x_(i+1) = (x_i)^2 mod n
    this.x = (this.x * this.x) % this.n;

    // Zwrócenie najmniej znaczącego bitu
    return this.x % 2;
  }

  // Generowanie sekwencji bitów o zadanej długości
  generateBits(length) {
    let bits = '';
    for (let i = 0; i < length; i++) {
      bits += this.nextBit();
    }
    return bits;
  }
}
