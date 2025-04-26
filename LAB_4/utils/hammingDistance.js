// Funkcja do obliczania odległości Hamminga między dwoma łańcuchami hex
export function hammingDistance(hex1, hex2) {
  // Konwertujemy łańcuchy hex na binarne
  const bin1 = hex1
    .split('')
    .map((h) => parseInt(h, 16).toString(2).padStart(4, '0'))
    .join('');

  const bin2 = hex2
    .split('')
    .map((h) => parseInt(h, 16).toString(2).padStart(4, '0'))
    .join('');

  // Obliczamy odległość Hamminga (liczbę różnych bitów)
  let distance = 0;
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] !== bin2[i]) {
      distance++;
    }
  }
  return distance;
}
