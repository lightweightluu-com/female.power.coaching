// Erzeugt den SHA-256-Hash für das Admin-Passwort.
//   node scripts/admin-hash.mjs "mein neues passwort"
// Den ausgegebenen Wert in .github/workflows/deploy.yml bei ADMIN_HASH eintragen.
// Leerzeichen, Bindestriche und Gross-/Kleinschreibung zählen nicht (wie beim Login).
import { createHash } from 'node:crypto';

const input = process.argv.slice(2).join(' ');
if (input.replace(/[\s-]/g, '').length < 16) {
  console.error('Bitte ein langes Passwort angeben (mindestens 16 Zeichen), z. B. per Passwort-Manager erzeugt.');
  process.exit(1);
}
console.log(createHash('sha256').update(input.replace(/[\s-]/g, '').toLowerCase()).digest('hex'));
