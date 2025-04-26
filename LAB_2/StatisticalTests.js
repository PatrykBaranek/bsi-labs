export class StatisticalTests {
  // Test częstotliwości (Monobit)
  frequencyTest(bits) {
    let ones = 0;
    let zeros = 0;

    for (let i = 0; i < bits.length; i++) {
      if (bits[i] === '1') {
        ones++;
      } else {
        zeros++;
      }
    }

    const proportion = ones / bits.length;
    const expectedProportion = 0.5;
    const deviation = Math.abs(proportion - expectedProportion);

    console.log('\nWyniki testu częstotliwości:');
    console.log(`- Liczba jedynek: ${ones}`);
    console.log(`- Liczba zer: ${zeros}`);
    console.log(`- Proporcja jedynek: ${proportion.toFixed(4)}`);
    console.log(`- Odchylenie od oczekiwanego: ${deviation.toFixed(4)}`);

    // Proste kryterium zaliczenia/niezaliczenia
    return deviation < 0.05;
  }

  // Test serii
  runsTest(bits) {
    let runs = 1;
    let expectedRuns = 1 + (bits.length - 1) * 0.5;

    for (let i = 1; i < bits.length; i++) {
      if (bits[i] !== bits[i - 1]) {
        runs++;
      }
    }

    const proportion = runs / expectedRuns;

    console.log('\nWyniki testu serii:');
    console.log(`- Liczba serii: ${runs}`);
    console.log(`- Oczekiwana liczba serii: ${expectedRuns.toFixed(2)}`);
    console.log(
      `- Proporcja faktycznej / oczekiwanej: ${proportion.toFixed(4)}\n`
    );

    // Proste kryterium zaliczenia/niezaliczenia
    return Math.abs(proportion - 1) < 0.1;
  }
}
