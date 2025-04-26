import { readMessageFromFile } from './readMessageFromFile.js';
import { splitIntoBlocks } from './utils/blocks/splitIntoBlocks.js';
import { generateRSAKeys } from './utils/RSA/generateRSAKeys.js';
import { blockToNumber } from './utils/blocks/blockToNumber.js';
import { numberToBlock } from './utils/blocks/numberToBlock.js';
import { encryptNumber } from './utils/RSA/encryptNumber.js';
import { decryptBuffer } from './utils/RSA/decryptBuffer.js';

// Konfiguracja
const BLOCK_SIZE = 10; // Rozmiar bloku w znakach
const KEY_SIZE = 768; // Rozmiar klucza w bitach
const ALPHABET_TYPE = 'ascii'; // Opcje: '26' (a-z), '64' (alphanumeryczne), 'ascii' (pełny ASCII)

// Definicje alfabetów
const ALPHABETS = {
  26: 'abcdefghijklmnopqrstuvwxyz',
  64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  ascii: Array.from({ length: 128 }, (_, i) => String.fromCharCode(i)).join(''),
};

async function main() {
  const inputFilePath = 'message.txt';

  // Wybór alfabetu
  const alphabet = ALPHABETS[ALPHABET_TYPE];
  console.log(
    `Używany typ alfabetu: ${ALPHABET_TYPE} z ${alphabet.length} znakami`
  );

  const originalMessage = readMessageFromFile(inputFilePath);
  console.log(`Oryginalna wiadomość: ${originalMessage}`);

  // Podział tekstu na bloki
  const blocks = splitIntoBlocks(originalMessage, BLOCK_SIZE);
  console.log(`Podzielono na ${blocks.length} bloków:`, blocks);

  // Konwersja bloków na liczby
  const numbers = blocks.map((block) => blockToNumber(block, alphabet));
  console.log(
    'Przekonwertowano na liczby:',
    numbers.map((n) => n.toString())
  );

  // Generowanie kluczy RSA
  console.log(`Generowanie kluczy RSA (${KEY_SIZE} bitów)...`);
  const { publicKey, privateKey } = await generateRSAKeys(128);
  console.log('Klucze wygenerowane pomyślnie');
  console.log('Klucz publiczny: ', publicKey);
  console.log('Klucz prywatny: ', privateKey);

  // Szyfrowanie liczb
  console.log('Szyfrowanie wiadomości blok po bloku...');
  const encryptedBuffers = [];

  for (const number of numbers) {
    const encryptedBuffer = encryptNumber(number, publicKey);
    encryptedBuffers.push(encryptedBuffer);
  }

  console.log(
    'Zaszyfrowane dane:',
    encryptedBuffers.map((b) => b.toString('hex').substring(0, 20) + '...')
  );

  // Odszyfrowanie buforów
  console.log('Odszyfrowanie wiadomości blok po bloku...');
  const decryptedNumbers = [];

  for (const encryptedBuffer of encryptedBuffers) {
    const decryptedNumber = decryptBuffer(encryptedBuffer, privateKey);
    decryptedNumbers.push(decryptedNumber);
  }

  console.log(
    'Odszyfrowane liczby:',
    decryptedNumbers.map((n) => n.toString())
  );

  // Konwersja liczb z powrotem na bloki tekstu
  const decryptedBlocks = decryptedNumbers.map((number) =>
    numberToBlock(number, alphabet, BLOCK_SIZE)
  );
  console.log('Odszyfrowane bloki:', decryptedBlocks);

  // Połączenie bloków w celu utworzenia odszyfrowanej wiadomości
  const decryptedMessage = decryptedBlocks.join('');
  console.log(`Odszyfrowana wiadomość: ${decryptedMessage}`);

  // Weryfikacja poprawności odszyfrowania
  console.log('\nWeryfikacja:');
  let allBlocksMatch = true;

  for (let i = 0; i < blocks.length; i++) {
    const originalBlock = blocks[i];
    const decryptedBlock = decryptedBlocks[i];
    const blockMatch = originalBlock === decryptedBlock;

    console.log(
      `Blok ${
        i + 1
      }: Oryginalny "${originalBlock}" -> Odszyfrowany "${decryptedBlock}" -> ${
        blockMatch ? 'ZGODNE' : 'NIEZGODNE'
      }`
    );

    if (!blockMatch) {
      allBlocksMatch = false;
    }
  }

  console.log(
    `\nWynik weryfikacji: ${allBlocksMatch ? 'SUKCES' : 'NIEPOWODZENIE'}`
  );
}

main();
