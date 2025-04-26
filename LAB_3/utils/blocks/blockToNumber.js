export function blockToNumber(block, alphabet) {
  let number = 0n;
  const base = BigInt(alphabet.length);

  for (let i = 0; i < block.length; i++) {
    const charIndex = alphabet.indexOf(block[i]);
    if (charIndex === -1) {
      // Obsługa znaków spoza alfabetu (zastąpienie spacją lub indeksem 0)
      number = number * base + 0n;
    } else {
      number = number * base + BigInt(charIndex);
    }
  }

  return number;
}
