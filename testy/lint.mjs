/* Lint bez zależności zewnętrznych:
   - składnia JS (js/*.js) przez `node --check`,
   - CSS: parzystość klamer, brak pustych reguł,
   - HTML: zbalansowane <section>/<div>/<details>, brak podwójnych id, brak niezamkniętych <a>,
   - brak myślników typograficznych „—” w treści widocznej (zasada z CLAUDE.md), z wyjątkiem plików odziedziczonych. */
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
let bledy = 0;
const zle = (m) => { bledy++; console.error('  ✗ ' + m); };

for (const f of await readdir(join(ROOT, 'js'))) {
  try { execFileSync(process.execPath, ['--check', join(ROOT, 'js', f)], { stdio: 'pipe' }); console.log(`  ✓ js/${f}: składnia OK`); }
  catch (e) { zle(`js/${f}: ${e.stderr}`); }
}

const css = await readFile(join(ROOT, 'css/dewax.css'), 'utf8');
const otw = (css.match(/{/g) || []).length, zam = (css.match(/}/g) || []).length;
if (otw !== zam) zle(`css/dewax.css: klamry ${otw} vs ${zam}`); else console.log('  ✓ css/dewax.css: klamry zbalansowane');
if (/{\s*}/.test(css)) zle('css/dewax.css: pusta reguła');

for (const s of ['index.html', 'pompy.html', 'dla-instalatorow.html']) {
  const h = await readFile(join(ROOT, s), 'utf8');
  for (const tag of ['section', 'div', 'details', 'ul', 'ol', 'li', 'table', 'form', 'a', 'button', 'figure', 'main', 'header', 'footer', 'nav', 'article', 'aside']) {
    const o = (h.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length, c = (h.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (o !== c) zle(`${s}: <${tag}> otwarte ${o}, zamknięte ${c}`);
  }
  const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) zle(`${s}: powtórzone id: ${[...new Set(dup)].join(', ')}`);
  const widoczne = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const pauzy = (widoczne.match(/—/g) || []).length;
  if (pauzy > 0) zle(`${s}: ${pauzy} pauz „—” w treści widocznej (zasada: przecinki, dwukropki, kropki)`);
  else console.log(`  ✓ ${s}: struktura OK, bez pauz „—”`);
}

if (bledy) { console.error(`\nLint: ${bledy} problem(ów).`); process.exit(1); }
console.log('\nLint: bez uwag.');
