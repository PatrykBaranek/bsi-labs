import { readMessageFromFile } from './utils/readMessageFromFile.js';
import { textToBits } from './utils/textToBits.js';
import { BlumBlumShub } from './BlumBlumShub.js';
import { StatisticalTests } from './StatisticalTests.js';
import { encryptMessage, decryptMessage } from './utils/encrypt.js';
import { bitsToText } from './utils/bitsToText.js';

function main() {
  const message =
    readMessageFromFile() ||
    'Domyslna wiadomosc, jesli plik nie zostal znaleziony';
  console.log('Oryginalna wiadomość:', message);

  // Zamiana wiadomości na bity
  const messageBits = textToBits(message);
  console.log('\nWiadomość w bitach:\n', messageBits);

  // Inicjalizacja generatora BBS
  const bbs = new BlumBlumShub();

  // Generowanie klucza odpowiedniej długości
  const keyBits = bbs.generateBits(messageBits.length);
  console.log('\nWygenerowane bity klucza:\n', keyBits);

  // Test losowości klucza
  const tests = new StatisticalTests();
  const frequencyTestPassed = tests.frequencyTest(keyBits);
  const runsTestPassed = tests.runsTest(keyBits);

  console.log(`Test częstotliwości zaliczony: ${frequencyTestPassed}`);
  console.log(`Test serii zaliczony: ${runsTestPassed}`);

  if (!frequencyTestPassed || !runsTestPassed) {
    console.warn(
      '\nOstrzeżenie: Wygenerowany klucz może nie być wystarczająco losowy\n'
    );
  }

  // Szyfrowanie wiadomości
  const encryptedBits = encryptMessage(messageBits, keyBits);
  console.log('\nZaszyfrowane bity:\n', encryptedBits);

  // Deszyfrowanie wiadomości
  const decryptedBits = decryptMessage(encryptedBits, keyBits);
  console.log('\nOdszyfrowane bity:\n', decryptedBits);

  // Zamiana odszyfrowanych bitów z powrotem na tekst
  const decryptedMessage = bitsToText(decryptedBits);
  console.log('\nOdszyfrowana wiadomość:\n', decryptedMessage);

  // Weryfikacja
  console.log(
    '\nWeryfikacja:',
    message === decryptedMessage ? 'SUKCES' : 'NIEPOWODZENIE'
  );
}

main();
