import crypto from 'node:crypto';

import { hammingDistance } from './utils/hammingDistance.js';
import { SHA256 } from './utils/SHA256.js';

// Funkcja pomocnicza do zmiany jednego bitu w tekście
function flipBit(str, position) {
  const bytes = Buffer.from(str);
  const bytePos = Math.floor(position / 8);
  const bitPos = position % 8;

  if (bytePos < bytes.length) {
    // Odwracamy określony bit
    bytes[bytePos] ^= 1 << (7 - bitPos);
    return bytes.toString();
  }
  return str;
}

function main() {
  const sha256 = new SHA256();

  console.log('=== TESTOWANIE WŁASNOŚCI FUNKCJI SKRÓTU SHA-256 ===\n');

  // 1. Sprawdzenie czy można skrócić tekst "dowolnej" długości
  console.log('1. Czy można skrócić tekst dowolnej długości?');

  const shortText = 'a';
  const shortHash = sha256.hash(shortText);
  console.log(` - Krótki tekst (1 bajt): ${shortText}`);
  console.log(` - Skrót: ${shortHash}`);

  const mediumText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  const mediumHash = sha256.hash(mediumText);
  console.log(` - Średni tekst (${mediumText.length} bajtów): "${mediumText}"`);
  console.log(` - Skrót: ${mediumHash}`);

  let longText = '';
  for (let i = 0; i < 1000; i++) {
    longText += 'a';
  }
  const longHash = sha256.hash(longText);
  console.log(
    ` - Długi tekst (${longText.length} bajtów): "a" powtórzone 1000 razy`
  );
  console.log(` - Skrót: ${longHash}`);
  console.log(
    ' - WNIOSEK: TAK, SHA-256 może skracać teksty o dowolnej długości.\n'
  );

  // 2. Sprawdzenie czy zmiana 1 bitu powoduje istotną zmianę skrótu
  console.log('2. Czy zmiana 1 losowego bitu zmienia skrót istotnie?');

  const originalText =
    'Sprawdzanie wrażliwości funkcji skrótu na zmiany bitów.';
  const originalHash = sha256.hash(originalText);
  console.log(` - Oryginalny tekst: "${originalText}"`);
  console.log(` - Oryginalny skrót: ${originalHash}`);

  // Zmieniamy jeden losowy bit w tekście
  const randomBitPosition = Math.floor(
    Math.random() * (originalText.length * 8)
  );
  const modifiedText = flipBit(originalText, randomBitPosition);
  const modifiedHash = sha256.hash(modifiedText);

  console.log(
    ` - Zmieniony tekst (bit na pozycji ${randomBitPosition}): "${modifiedText}"`
  );
  console.log(` - Zmieniony skrót: ${modifiedHash}`);

  const bitDifference = hammingDistance(originalHash, modifiedHash);
  const percentageDifference = (bitDifference / 256) * 100;

  console.log(
    ` - Liczba różnych bitów: ${bitDifference} z 256 (${percentageDifference.toFixed(
      2
    )}%)`
  );
  console.log(
    ` - WNIOSEK: ${
      percentageDifference > 40 ? 'TAK' : 'NIE'
    }, zmiana skrótu jest istotna.\n`
  );

  // 3. Sprawdzenie odległości Hamminga dla różnych tekstów
  console.log(
    '3. Czy odległość Hamminga między skrótami różnych tekstów jest duża?'
  );

  const text1 = 'Pierwszy przykladowy tekst do testowania funkcji SHA-256.';
  const text2 = 'Drugi przykladowy tekst do testowania funkcji SHA-256.';

  const hash1 = sha256.hash(text1);
  const hash2 = sha256.hash(text2);

  console.log(` - Tekst 1: "${text1}"`);
  console.log(` - Skrót 1: ${hash1}`);
  console.log(` - Tekst 2: "${text2}"`);
  console.log(` - Skrót 2: ${hash2}`);

  const hammingDist = hammingDistance(hash1, hash2);
  const hammingPercentage = (hammingDist / 256) * 100;

  console.log(
    ` - Odległość Hamminga: ${hammingDist} z 256 (${hammingPercentage.toFixed(
      2
    )}%)`
  );
  console.log(
    ` - WNIOSEK: ${
      hammingPercentage > 40 ? 'TAK' : 'NIE'
    }, odległość Hamminga jest duża.\n`
  );

  // 4. Sprawdzenie czy skrót ma zawsze tę samą długość
  console.log('4. Czy tworzony jest skrót o zawsze tej samej długości?');

  const texts = [
    'a',
    'ab',
    'abc',
    'abcd',
    'Lorem ipsum dolor sit amet',
    'Bardzo długi tekst '.repeat(50),
  ];

  const hashLengths = texts.map((text) => {
    const h = sha256.hash(text);
    return {
      text: text.length > 20 ? text.substring(0, 20) + '...' : text,
      hash: h,
      length: h.length,
    };
  });

  hashLengths.forEach((item) => {
    console.log(` - Tekst (${item.text.length} bajtów): "${item.text}"`);
    console.log(
      ` - Długość skrótu: ${item.length} znaków hex (${item.length * 4} bitów)`
    );
  });

  const allSameLength = hashLengths.every(
    (item) => item.length === hashLengths[0].length
  );
  console.log(
    ` - WNIOSEK: ${
      allSameLength ? 'TAK' : 'NIE'
    }, skrót ma zawsze tę samą długość.\n`
  );

  // Porównanie wydajności z biblioteką
  console.log('=== PORÓWNANIE WYDAJNOŚCI ===');

  // Test własnej implementacji
  const testText = 'Tekst do testowania wydajnosci implementacji SHA-256.';
  const iterations = 1000;

  console.log(`Testowanie na tekście: "${testText}"`);
  console.log(`Liczba iteracji: ${iterations}`);

  // Test własnej implementacji
  const startCustom = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    sha256.hash(testText);
  }
  const endCustom = process.hrtime.bigint();
  const customTime = Number(endCustom - startCustom) / 1e6; // w milisekundach

  // Test implementacji bibliotecznej
  const startLib = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    crypto.createHash('sha256').update(testText).digest('hex');
  }
  const endLib = process.hrtime.bigint();
  const libTime = Number(endLib - startLib) / 1e6; // w milisekundach

  console.log(
    `Czas dla własnej implementacji: ${customTime.toFixed(2)} ms (${(
      customTime / iterations
    ).toFixed(4)} ms/hash)`
  );
  console.log(
    `Czas dla implementacji bibliotecznej: ${libTime.toFixed(2)} ms (${(
      libTime / iterations
    ).toFixed(4)} ms/hash)`
  );
  console.log(
    `Stosunek własnej implementacji do bibliotecznej: ${(
      customTime / libTime
    ).toFixed(2)}x wolniej`
  );

  // Sprawdzenie poprawności implementacji
  const testCases = [
    {
      input: 'abc',
      expected:
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    },
    {
      input: '',
      expected:
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      input: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
      expected:
        '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    },
  ];

  console.log('\n=== WERYFIKACJA POPRAWNOŚCI IMPLEMENTACJI ===');

  let allCorrect = true;
  testCases.forEach((testCase) => {
    const result = sha256.hash(testCase.input);
    const correct = result === testCase.expected;
    console.log(
      `Dane wejściowe: "${
        testCase.input.length > 20
          ? testCase.input.substring(0, 20) + '...'
          : testCase.input
      }"`
    );
    console.log(`Oczekiwany skrót: ${testCase.expected}`);
    console.log(`Uzyskany skrót:  ${result}`);
    console.log(`Status: ${correct ? 'POPRAWNY' : 'NIEPOPRAWNY'}`);
    console.log();

    if (!correct) allCorrect = false;
  });

  console.log(
    `Ogólny wynik testów: ${
      allCorrect ? 'WSZYSTKIE TESTY POPRAWNE' : 'NIEKTÓRE TESTY NIEPOPRAWNE'
    }`
  );
}

// Uruchomienie testów
main();
