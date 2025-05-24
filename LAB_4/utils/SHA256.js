export class SHA256 {
  constructor() {
    // Inicjalizacja stałych hash (pierwsze 32 bity ułamkowych części pierwiastków kwadratowych pierwszych 8 liczb pierwszych)
    this.h0 = 0x6a09e667;
    this.h1 = 0xbb67ae85;
    this.h2 = 0x3c6ef372;
    this.h3 = 0xa54ff53a;
    this.h4 = 0x510e527f;
    this.h5 = 0x9b05688c;
    this.h6 = 0x1f83d9ab;
    this.h7 = 0x5be0cd19;

    // Stałe k (pierwsze 32 bity ułamkowych części sześcianów pierwszych 64 liczb pierwszych)
    this.k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
      0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
      0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
      0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
      0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];
  }

  // Funkcje pomocnicze
  rightRotate(value, amount) {
    return ((value >>> amount) | (value << (32 - amount))) >>> 0;
  }

  // Funkcje logiczne SHA-256
  ch(x, y, z) {
    return ((x & y) ^ (~x & z)) >>> 0;
  }

  maj(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z)) >>> 0;
  }

  sigma0(x) {
    return (
      (this.rightRotate(x, 2) ^
        this.rightRotate(x, 13) ^
        this.rightRotate(x, 22)) >>>
      0
    );
  }

  sigma1(x) {
    return (
      (this.rightRotate(x, 6) ^
        this.rightRotate(x, 11) ^
        this.rightRotate(x, 25)) >>>
      0
    );
  }

  gamma0(x) {
    return (this.rightRotate(x, 7) ^ this.rightRotate(x, 18) ^ (x >>> 3)) >>> 0;
  }

  gamma1(x) {
    return (
      (this.rightRotate(x, 17) ^ this.rightRotate(x, 19) ^ (x >>> 10)) >>> 0
    );
  }

  // Konwersja string na tablicę bajtów
  stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i) & 0xff);
    }
    return bytes;
  }

  // Padding wiadomości
  pad(message) {
    const bytes = Array.isArray(message)
      ? message
      : this.stringToBytes(message);
    const len = bytes.length;
    const bitLen = len * 8;

    // Dodajemy bit 1 na końcu
    bytes.push(0x80);

    // Dodajemy zera do długości kongruentnej do 448 mod 512
    while ((bytes.length * 8) % 512 !== 448) {
      bytes.push(0);
    }

    // Dopisujemy długość jako 64-bitową liczbę
    const lenBytes = new Array(8).fill(0);
    for (let i = 0; i < 8; i++) {
      lenBytes[7 - i] = (bitLen >>> (i * 8)) & 0xff;
    }

    return bytes.concat(lenBytes);
  }

  // Główna funkcja hash
  hash(message) {
    const paddedMessage = this.pad(message);

    // Inicjalizacja wartości hash
    let h0 = this.h0;
    let h1 = this.h1;
    let h2 = this.h2;
    let h3 = this.h3;
    let h4 = this.h4;
    let h5 = this.h5;
    let h6 = this.h6;
    let h7 = this.h7;

    // Przetwarzanie wiadomości w blokach 64-bajtowych (512 bitów)
    for (let i = 0; i < paddedMessage.length; i += 64) {
      // Tworzymy 16 słów 32-bitowych
      const w = new Array(64).fill(0);
      for (let j = 0; j < 16; j++) {
        w[j] =
          (paddedMessage[i + j * 4] << 24) |
          (paddedMessage[i + j * 4 + 1] << 16) |
          (paddedMessage[i + j * 4 + 2] << 8) |
          paddedMessage[i + j * 4 + 3];
      }

      // Rozszerzamy 16 słów do 64 słów
      for (let j = 16; j < 64; j++) {
        w[j] =
          (this.gamma1(w[j - 2]) +
            w[j - 7] +
            this.gamma0(w[j - 15]) +
            w[j - 16]) >>>
          0;
      }

      // Inicjalizacja zmiennych roboczych
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;

      // Główna pętla kompresji
      for (let j = 0; j < 64; j++) {
        const temp1 =
          (h + this.sigma1(e) + this.ch(e, f, g) + this.k[j] + w[j]) >>> 0;
        const temp2 = (this.sigma0(a) + this.maj(a, b, c)) >>> 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      // Dodajemy skompresowany blok do bieżącego hash
      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
      h5 = (h5 + f) >>> 0;
      h6 = (h6 + g) >>> 0;
      h7 = (h7 + h) >>> 0;
    }

    // Konwertujemy hasz na łańcuch hex
    return [h0, h1, h2, h3, h4, h5, h6, h7]
      .map((h) => h.toString(16).padStart(8, '0'))
      .join('');
  }
}
