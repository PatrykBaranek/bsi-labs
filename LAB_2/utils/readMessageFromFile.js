import fs from 'node:fs';

export function readMessageFromFile() {
  try {
    return fs.readFileSync('message.txt', 'utf8');
  } catch (error) {
    console.error('Błąd odczytu pliku:', error);
    return null;
  }
}
