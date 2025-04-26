export function textToBits(text) {
  let bits = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const binary = charCode.toString(2).padStart(8, '0');
    bits += binary;
  }
  return bits;
}
