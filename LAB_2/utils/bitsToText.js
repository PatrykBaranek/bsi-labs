export function bitsToText(bits) {
  let text = '';
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substr(i, 8);
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
}
