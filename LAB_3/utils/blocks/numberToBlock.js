export function numberToBlock(number, alphabet, blockSize) {
  let block = '';
  const base = BigInt(alphabet.length);

  // Obsługa specjalnego przypadku dla 0
  if (number === 0n) {
    return alphabet[0].repeat(blockSize);
  }

  // Konwersja liczby z powrotem na znaki
  let tempNumber = number;
  while (tempNumber > 0n) {
    const remainder = Number(tempNumber % base);
    block = alphabet[remainder] + block;
    tempNumber = tempNumber / base;
  }

  // Uzupełnienie wiodącymi znakami jeśli konieczne
  return block.padStart(blockSize, alphabet[0]);
}
