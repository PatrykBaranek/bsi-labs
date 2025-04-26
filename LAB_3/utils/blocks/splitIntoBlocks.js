export function splitIntoBlocks(text, blockSize) {
  const blocks = [];

  for (let i = 0; i < text.length; i += blockSize) {
    blocks.push(text.slice(i, i + blockSize));
  }

  // Uzupełnienie ostatniego bloku jeśli jest niepełny
  if (blocks.length > 0 && blocks[blocks.length - 1].length < blockSize) {
    blocks[blocks.length - 1] = blocks[blocks.length - 1].padEnd(
      blockSize,
      ' '
    );
  }

  return blocks;
}
