/* Lokalny serwer deweloperski. NIE JEST CZĘŚCIĄ WDROŻENIA.
   Serwuje pliki statyczne z katalogu projektu i naśladuje zachowanie
   wyslij.php (walidacja, honeypot, przekierowania), bo na komputerze
   deweloperskim nie ma PHP. Maila oczywiście nie wysyła: wypisuje treść
   zgłoszenia w konsoli.
   Użycie: node testy/serwer-dev.mjs  (port 8787, zmienna PORT nadpisuje) */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = +(process.env.PORT || 8787);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };

function strona(tytul, h1, tresc) {
  return `<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${tytul}</title><style>body{font-family:system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:0 24px;color:#1C1C2E;line-height:1.65}h1{font-size:26px;color:#000050;margin-bottom:12px}a{color:#2F6D9E}</style></head><body><h1>${h1}</h1>${tresc}</body></html>`;
}

/* wierne odwzorowanie wyslij.php */
function wyslij(req, res, body) {
  const p = new URLSearchParams(body);
  const pole = (k, max = 500) => (p.get(k) || '').trim().replace(/[\r\n]|%0a|%0d/gi, ' ').slice(0, max);
  if ((p.get('bot-field') || '') !== '') { res.writeHead(302, { Location: 'podziekowanie.html' }); return res.end(); }
  const czas = parseInt(p.get('czas') || '0', 10) || 0;
  if (czas > 0 && czas < 3) { res.writeHead(302, { Location: 'podziekowanie.html' }); return res.end(); }
  const imie = pole('imie', 100), email = pole('email', 150), miejscowosc = pole('miejscowosc', 100), metraz = pole('metraz', 10);
  const bledy = [];
  if (!imie) bledy.push('imię');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bledy.push('poprawny e-mail');
  if (!miejscowosc) bledy.push('miejscowość');
  if (metraz === '' || !/^\d+$/.test(metraz)) bledy.push('metraż (liczba)');
  if (bledy.length) {
    res.writeHead(422, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(strona('Uzupełnij formularz', 'Brakuje kilku danych', `<p>Uzupełnij: <b>${bledy.join(', ')}</b>.</p><p><a href="javascript:history.back()">← Wróć do formularza</a></p>`));
  }
  console.log('\n[wyslij.php - symulacja] Nowe zapytanie o wycenę');
  for (const k of ['imie', 'email', 'telefon', 'miejscowosc', 'metraz', 'ogrzewanie', 'wiadomosc', 'zgoda_dane', 'zgoda_telefon', 'czas']) console.log(`  ${k.padEnd(14)} ${p.get(k) || '-'}`);
  res.writeHead(302, { Location: 'podziekowanie.html' }); res.end();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let path = decodeURIComponent(url.pathname);
  if (path === '/wyslij.php') {
    if (req.method !== 'POST') { res.writeHead(302, { Location: 'index.html' }); return res.end(); }
    let body = ''; req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => wyslij(req, res, body));
    return;
  }
  if (path === '/') path = '/index.html';
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try {
    const st = await stat(file);
    if (!st.isFile()) throw new Error('dir');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    try {
      const nf = await readFile(join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(nf);
    } catch { res.writeHead(404); res.end('404'); }
  }
});
server.listen(PORT, () => console.log(`pompy.dewax.pl lokalnie: http://localhost:${PORT}/  (Ctrl+C kończy)`));
