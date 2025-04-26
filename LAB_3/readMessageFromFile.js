import fs from 'node:fs';

// Funkcja do wczytywania wiadomości z pliku
export function readMessageFromFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Błąd odczytu pliku:', error);
    process.exit(1);
  }
}
