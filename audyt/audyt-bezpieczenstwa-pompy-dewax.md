# Audyt bezpieczeństwa — pompy.dewax.pl

**Zleceniodawca:** DEWAX Sp. z o.o. (właściciel domeny)
**Data:** 15.08.2026
**Charakter testów:** wyłącznie pasywne (odczyt nagłówków, DNS, TLS). **Nie** wykonywano
brute-force, skanowania portów, prób logowania ani eksploitacji. Na serwerze nic nie zmieniono.

---

## ⚠️ NAJPIERW PRZECZYTAJ: zakres faktycznie wykonany

Audyt uruchomiono ze środowiska Claude Code, którego polityka sieciowa **blokuje ruch
wychodzący HTTPS** do hostów zewnętrznych. Połączenia do `pompy.dewax.pl:443` zwracały
`403` na etapie CONNECT proxy (blokada dotyczy też hostów kontrolnych, np. `example.com`),
więc **nie jest to problem po stronie Państwa serwera**.

| # | Punkt zakresu | Status |
|---|---|---|
| 1 | Nagłówki bezpieczeństwa HTTP (`/`, `/contact/`, `/quote/`, `/calculator`) | ❌ **NIEWYKONANE** — brak dostępu sieciowego |
| 2 | Nagłówki ujawniające stack (`Server`, `X-Powered-By`, `X-Page-Speed`) | ❌ **NIEWYKONANE** |
| 3 | TLS: certyfikat, wersje, przekierowanie HTTP→HTTPS, www/non-www | ⚠️ **CZĘŚCIOWO** — patrz sekcja 3 (DNS tak, certyfikat nie) |
| 4 | Publicznie dostępne pliki i katalogi (`/.git/config`, `/.env`, …) | ❌ **NIEWYKONANE** |
| 5 | Formularze: CSRF, honeypot/captcha, POST/HTTPS, walidacja | ❌ **NIEWYKONANE** |
| 6 | Ciasteczka + zgodność RODO (GTM przed zgodą) | ❌ **NIEWYKONANE** |
| 7 | Biblioteki JS/CSS i znane CVE | ❌ **NIEWYKONANE** |
| 8 | DNS: SPF, DKIM, DMARC — ryzyko podszycia się pod pocztę | ✅ **WYKONANE W CAŁOŚCI** |

**W tabeli ustaleń poniżej znajdują się wyłącznie fakty rzeczywiście zweryfikowane.**
Nie wpisano tam żadnych „prawdopodobnych" braków nagłówków ani domniemanych podatności —
byłoby to zgadywanie, a nie audyt. W sekcji 9 znajduje się gotowy skrypt, który wykona
punkty 1–7 z Państwa komputera w ok. 30 sekund; po przesłaniu jego wyniku uzupełnię raport.

### ❗ Ostrzeżenie dot. certyfikatu TLS

Proxy środowiska przechwytuje i **ponownie podpisuje** TLS. Połączenie `openssl s_client`
zwróciło certyfikat `CN=*.dewax.pl` wystawiony przez *„Anthropic Egress Gateway CA"*
z datą ważności do 14.09.2026. **To nie jest Państwa certyfikat** — to podstawiony
certyfikat proxy. Prawdziwego wystawcy, daty wygaśnięcia ani obsługiwanych wersji TLS
**nie dało się odczytać** i celowo nie są tu raportowane. Nie należy sugerować się tą datą.

---

## Tabela ustaleń (wyłącznie fakty zweryfikowane)

| # | Problem | Ryzyko | Jak naprawić |
|---|---|---|---|
| 1 | **Brak rekordu DMARC** dla `dewax.pl`. Zapytanie `_dmarc.dewax.pl TXT` zwraca NOERROR z zerową liczbą rekordów — potwierdzone na dwóch niezależnych resolwerach (8.8.8.8 i 1.1.1.1). Nie ma żadnej polityki wymuszania zgodności nadawcy ani raportowania nadużyć. | 🔴 **KRYTYCZNE** | Dodać rekord TXT `_dmarc.dewax.pl` — wdrożenie etapowe opisane w sekcji 8. |
| 2 | **Brak podpisu DKIM** — przeskanowano 18 najczęstszych selektorów (`default`, `selector1/2`, `google`, `mail`, `dkim`, `k1`, `s1/s2`, `home`, `hm1`, `smtp`, `key1`, `zoho`, `fm1` i in.), żaden nie zwrócił klucza. Uwaga metodologiczna: selektorów DKIM **nie da się wyliczyć z DNS**, więc jest to silna przesłanka, a nie dowód. | 🟠 **WYSOKIE** | Zweryfikować w panelu nazwa.pl, czy podpisywanie DKIM jest włączone; jeśli nie — włączyć i opublikować klucz. Weryfikacja: nagłówek `DKIM-Signature` w wysłanej wiadomości. |
| 3 | **SPF w trybie miękkim** — `v=spf1 mx a ~all`. Kwalifikator `~all` (softfail) oznacza, że wiadomości z nieautoryzowanych serwerów są zwykle **dostarczane**, najwyżej oznaczane. Rekord jest poprawny składniowo i mieści się w limicie 10 odwołań DNS. | 🟡 **ŚREDNIE** | Po potwierdzeniu, że wszystkie systemy wysyłkowe są ujęte w SPF, zmienić `~all` → `-all` (hardfail). **Nie zmieniać przed** analizą raportów DMARC — grozi utratą poczty. |
| 4 | **Kumulacja: softfail SPF + brak DKIM + brak DMARC.** Te trzy braki razem sprawiają, że podszycie się pod adres `@dewax.pl` jest technicznie trywialne, a odbiorca nie ma czym tego odrzucić. Przy profilu działalności (oferty, wyceny, faktury B2B) to wektor oszustwa „na fakturę"/BEC. | 🔴 **KRYTYCZNE** | Kolejność wdrożenia: DKIM → DMARC `p=none` → analiza raportów → `p=quarantine` → `p=reject`. |
| 5 | **Wildcard DNS `*.dewax.pl` → 85.128.139.207.** Losowa nazwa (`losowa-nazwa-xyz987.dewax.pl`) rozwiązuje się na adres serwera. Dowolna zmyślona subdomena wygląda więc na „prawdziwą" — ułatwia phishing pod Państwa marką (np. `platnosc-faktura.dewax.pl`) i utrudnia wykrycie nadużyć. | 🟡 **ŚREDNIE** | Usunąć rekord wildcard i zadeklarować wyłącznie używane subdomeny (`@`, `www`, `pompy`, `www.pompy`, `mail`, `smtp`, `poczta`). Jeśli wildcard jest potrzebny — serwer powinien odpowiadać `404`/`444` na nieznany `Host`. |
| 6 | **Poczta i WWW na jednym adresie IP** — `MX 10 dewax.pl` → 85.128.139.207, ten sam host co serwis WWW. Kompromitacja aplikacji webowej oznacza natychmiastowy dostęp do poczty firmowej, i odwrotnie. Adres IP serwisu jest publiczny przez rekord MX. | 🟡 **ŚREDNIE** | Rozważyć rozdzielenie poczty od hostingu WWW (osobna usługa pocztowa). Przy hostingu współdzielonym nazwa.pl to zwykle decyzja taryfowa, nie techniczna. |
| 7 | **Rekordy CAA skonfigurowane poprawnie** — `letsencrypt.org` i `certum.pl`, w tym warianty `issuewild`. Ogranicza to ryzyko wystawienia certyfikatu dla Państwa domeny przez inny urząd certyfikacji. | ✅ **DOBRZE** | Bez działań. Utrzymać przy ewentualnej zmianie dostawcy certyfikatu. |
| 8 | **www i non-www rozwiązują się na ten sam adres** — `dewax.pl`, `www.dewax.pl`, `pompy.dewax.pl`, `www.pompy.dewax.pl` → 85.128.139.207. Warstwa DNS jest spójna. **Czy** faktycznie następuje przekierowanie na HTTPS — nie zweryfikowano (brak dostępu HTTP). | ⚪ **DO WERYFIKACJI** | Sprawdzić skryptem z sekcji 9 (test A i B). |

---

## Szczegóły — punkt 8 zakresu (DNS i ryzyko podszycia się pod pocztę)

### Odczytane rekordy

```
dewax.pl.              TXT    "v=spf1 mx a ~all"
dewax.pl.              TXT    "45b64018edb02b31e24102e1401434a5ec9db0014cd1506179074d7ebe13a6c1"
_dmarc.dewax.pl.       TXT    — BRAK (NOERROR, 0 rekordów)
_domainkey.dewax.pl.   TXT    "dnssec nsec record"      ← wpis nietypowy, patrz niżej
dewax.pl.              MX     10 dewax.pl
dewax.pl.              NS     ns1.nazwa.pl, ns2.nazwa.pl, ns3.nazwa.pl
dewax.pl.              CAA    0 issue "letsencrypt.org" / "certum.pl"
                       CAA    0 issuewild "letsencrypt.org" / "certum.pl"
dewax.pl.              A      85.128.139.207
pompy.dewax.pl.        A      85.128.139.207
www.pompy.dewax.pl.    A      85.128.139.207
www.dewax.pl.          A      85.128.139.207
*.dewax.pl.            A      85.128.139.207   (wildcard — potwierdzony losową nazwą)
```

Drugi rekord TXT (ciąg heksadecymalny) to typowy token weryfikacji własności domeny —
sam w sobie nieszkodliwy. Warto jednak ustalić, **czyjej** usługi dotyczy, i usunąć go,
jeśli usługa nie jest już używana; „osierocone" tokeny weryfikacyjne bywają wykorzystywane
do przejęcia usługi w cudzej domenie.

Wpis `_domainkey.dewax.pl` o treści `"dnssec nsec record"` jest nietypowy — to zwykły
rekord TXT z takim tekstem, nie mechanizm DNSSEC. Nie stanowi zagrożenia, ale wygląda
na pozostałość po błędnej konfiguracji i warto go usunąć, żeby nie zaciemniał obrazu
przy diagnostyce DKIM.

### Ocena ryzyka podszycia się (spoofing)

**Ryzyko: WYSOKIE.** Uzasadnienie krok po kroku:

1. Napastnik wysyła wiadomość z `From: biuro@dewax.pl` z dowolnego serwera.
2. SPF wykrywa niezgodność, ale `~all` to **softfail** — rekomendacja RFC 7208 dla
   softfail brzmi „przyjmij, ewentualnie oznacz". Wiadomość zwykle trafia do skrzynki.
3. DKIM nie może uratować sytuacji — brak podpisu oznacza brak kryptograficznego dowodu
   pochodzenia, więc odbiorca nie ma pozytywnej przesłanki.
4. **DMARC nie istnieje**, więc serwer odbiorcy nie ma żadnej instrukcji od Państwa,
   co zrobić z niezgodną wiadomością — i domyślnie jej **nie odrzuca**.
5. Brak DMARC oznacza również **brak raportów RUA** — nie dowiecie się Państwo, że ktoś
   podszywa się pod Waszą domenę, dopóki nie zadzwoni oszukany klient.

Realny scenariusz dla Państwa branży: klient otrzymuje „ponaglenie do zapłaty" za pompę
ciepła, z Państwa adresu, ze zmienionym numerem konta. Z technicznego punktu widzenia
nic tego dziś nie blokuje. To jest powód, dla którego DMARC jest pozycją nr 1 na liście.

### Gotowe rekordy do wklejenia (panel DNS nazwa.pl)

**Krok 1 — DMARC w trybie obserwacji (bezpieczny, wdrożyć od razu):**

```
Nazwa:  _dmarc
Typ:    TXT
Wartość: v=DMARC1; p=none; rua=mailto:dmarc@dewax.pl; ruf=mailto:dmarc@dewax.pl; fo=1; adkim=r; aspf=r; pct=100
```

`p=none` **niczego nie blokuje** — wyłącznie zbiera raporty. To jedyny bezpieczny sposób
rozpoczęcia; pozwala zobaczyć, kto faktycznie wysyła pocztę w Państwa imieniu (CRM,
newsletter, sklep, księgowość), zanim cokolwiek zacznie być odrzucane.

**Krok 2 — po 2–4 tygodniach analizy raportów:**

```
v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@dewax.pl; fo=1
```

Następnie stopniowo `pct=50` → `pct=100`, a docelowo:

```
v=DMARC1; p=reject; rua=mailto:dmarc@dewax.pl; fo=1
```

**Krok 3 — dopiero po osiągnięciu `p=reject` i potwierdzeniu, że cała legalna poczta
przechodzi** — zaostrzyć SPF:

```
v=spf1 mx a -all
```

> ⚠️ Kolejność ma znaczenie. Zmiana `~all` → `-all` **przed** analizą raportów DMARC to
> najczęstsza przyczyna utraty poczty firmowej (np. faktury wysyłane przez zewnętrzny
> system księgowy nagle przestają docierać). Nie należy skracać tej ścieżki.

---

## 3 rzeczy do zrobienia w pierwszej kolejności

### 1. 🔴 Opublikować rekord DMARC (`p=none`) — dziś, czas: 5 minut

Jedyne potwierdzone ustalenie o randze krytycznej. Wklejenie rekordu z sekcji powyżej do
panelu nazwa.pl jest operacją bezodwrotną-bezpieczną (`p=none` nic nie blokuje), a od razu
uruchamia strumień raportów, bez których nie da się racjonalnie zaplanować kolejnych kroków.
Wymaga utworzenia skrzynki `dmarc@dewax.pl`.

### 2. 🟠 Włączyć DKIM w panelu hostingu — w tym tygodniu, czas: ok. 15 minut

nazwa.pl udostępnia podpisywanie DKIM w konfiguracji poczty. Bez DKIM docelowe
`p=reject` jest nieosiągalne, a dostarczalność Państwa poczty do Gmaila i Outlooka
pozostaje gorsza niż mogłaby być. Weryfikacja: wysłać wiadomość na prywatny Gmail →
„Pokaż oryginał" → sprawdzić `DKIM: 'PASS'`.

### 3. ⚪ Uruchomić skrypt z sekcji 9 i przesłać wynik — czas: 1 minuta

Punkty 1–7 zakresu (nagłówki, TLS, wystawione pliki, formularze, ciasteczka/RODO,
biblioteki JS) **pozostają niesprawdzone**. To znacząca część powierzchni ataku i nie
należy zakładać, że jest tam dobrze — ani że jest źle. Skrypt wykonuje wyłącznie
pasywne zapytania i po przesłaniu jego wyniku uzupełnię raport o brakujące sekcje.

---

## Sekcja 9 — skrypt uzupełniający punkty 1–7

Zapisany w repozytorium jako `audyt-uzupelniajacy.sh`. Uruchomienie z dowolnego
komputera z `bash`, `curl` i `openssl`:

```bash
chmod +x audyt-uzupelniajacy.sh
./audyt-uzupelniajacy.sh > wynik-audytu.txt 2>&1
```

Skrypt wykonuje **wyłącznie** operacje z Państwa zakresu: `curl -sI`, `curl -o /dev/null
-w "%{http_code}"`, `openssl s_client`. Nie wysyła formularzy, nie próbuje się logować,
nie skanuje portów, nie zmienia niczego na serwerze.

---

## Sekcja 10 — gotowa konfiguracja nagłówków bezpieczeństwa

> **Uwaga metodologiczna:** ponieważ nie udało się odczytać obecnych nagłówków ani
> zawartości stron, poniższe bloki są **kompletnym zestawem docelowym**, a nie listą
> „brakujących". Przed wdrożeniem należy sprawdzić skryptem, które nagłówki już są —
> zdublowanie niektórych (zwłaszcza CSP i HSTS) potrafi dać efekt inny od zamierzonego.

### Apache — `.htaccess`

```apache
# ==========================================================
#  Nagłówki bezpieczeństwa — pompy.dewax.pl
# ==========================================================
<IfModule mod_headers.c>

    # HSTS — wymuszenie HTTPS na 1 rok.
    # UWAGA: wdrażać DOPIERO gdy HTTPS działa poprawnie na WSZYSTKICH subdomenach,
    # bo includeSubDomains obejmie też mail./smtp./poczta.
    # Na start bezpieczniej bez includeSubDomains i z krótkim max-age (np. 300),
    # a po tygodniu bezawaryjnego działania podnieść do 31536000.
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    # Zabezpieczenie przed osadzaniem w ramce (clickjacking)
    Header always set X-Frame-Options "SAMEORIGIN"

    # Blokada zgadywania typu MIME
    Header always set X-Content-Type-Options "nosniff"

    # Ograniczenie wycieku adresu URL w nagłówku Referer
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # Wyłączenie nieużywanych API przeglądarki
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()"

    # Izolacja okna otwierającego
    Header always set Cross-Origin-Opener-Policy "same-origin"

    # --- CSP ---
    # KROK 1: tryb raportowania. NIE blokuje niczego — pozwala zobaczyć w konsoli
    # przeglądarki (zakładka Console/Network), co zostałoby zablokowane.
    # Zostawić na 1-2 tygodnie, zebrać naruszenia, dopiero potem przełączyć.
    Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'"

    # KROK 2: po weryfikacji zakomentować powyższe i odkomentować poniższe.
    # Docelowo należy usunąć 'unsafe-inline' ze script-src i przejść na nonce.
    # Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'"

    # Ukrycie wersji oprogramowania (punkt 2 zakresu)
    Header always unset X-Powered-By
    Header always unset X-Page-Speed
    Header always unset X-AspNet-Version
    Header always unset X-Generator
</IfModule>

# Ukrycie sygnatury Apache (o ile hosting na to pozwala)
ServerSignature Off
<IfModule mod_php.c>
    php_flag expose_php Off
</IfModule>

# ==========================================================
#  Wymuszenie HTTPS + kanonizacja www → non-www
# ==========================================================
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

    RewriteCond %{HTTP_HOST} ^www\.pompy\.dewax\.pl$ [NC]
    RewriteRule ^(.*)$ https://pompy.dewax.pl/$1 [R=301,L]
</IfModule>

# ==========================================================
#  Blokada wrażliwych plików i katalogów (punkt 4 zakresu)
# ==========================================================
Options -Indexes

RedirectMatch 404 (?i)/\.git(/|$)
RedirectMatch 404 (?i)/\.env(\..*)?$
RedirectMatch 404 (?i)/\.(svn|hg|bzr|DS_Store|idea|vscode)(/|$)

<FilesMatch "(?i)^(\.env.*|composer\.(json|lock)|package(-lock)?\.json|yarn\.lock|phpinfo\.php|info\.php|\.htaccess|\.htpasswd|.*\.(sql|sqlite|bak|backup|old|orig|save|swp|log|ini|conf|zip|tar|gz|7z|rar))$">
    Require all denied
</FilesMatch>

# ==========================================================
#  Ciasteczka — flagi bezpieczeństwa (punkt 6 zakresu)
# ==========================================================
<IfModule mod_php.c>
    php_value session.cookie_secure   1
    php_value session.cookie_httponly 1
    php_value session.cookie_samesite "Lax"
</IfModule>
```

### nginx

```nginx
# ==========================================================
#  Przekierowanie HTTP -> HTTPS
# ==========================================================
server {
    listen 80;
    listen [::]:80;
    server_name pompy.dewax.pl www.pompy.dewax.pl;
    return 301 https://pompy.dewax.pl$request_uri;
}

# ==========================================================
#  Kanonizacja www -> non-www (po HTTPS)
# ==========================================================
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.pompy.dewax.pl;

    ssl_certificate     /etc/letsencrypt/live/pompy.dewax.pl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pompy.dewax.pl/privkey.pem;

    return 301 https://pompy.dewax.pl$request_uri;
}

# ==========================================================
#  Serwer właściwy
# ==========================================================
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name pompy.dewax.pl;

    root /var/www/pompy.dewax.pl;
    index index.php index.html;

    # ---------- TLS ----------
    ssl_certificate     /etc/letsencrypt/live/pompy.dewax.pl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pompy.dewax.pl/privkey.pem;

    # Tylko TLS 1.2 i 1.3 — wyłącza przestarzałe TLS 1.0/1.1
    ssl_protocols             TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers               ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_session_cache         shared:SSL:10m;
    ssl_session_timeout       1d;
    ssl_session_tickets       off;
    ssl_stapling              on;
    ssl_stapling_verify       on;

    # ---------- Nagłówki bezpieczeństwa ----------
    # Uwaga: w nginx add_header z danego bloku NIE dziedziczy się, jeśli
    # w bloku zagnieżdżonym (np. location) pojawi się własny add_header.
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options           "SAMEORIGIN" always;
    add_header X-Content-Type-Options    "nosniff" always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy        "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;

    # CSP — KROK 1: tryb raportowania (nie blokuje).
    add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" always;

    # CSP — KROK 2: po weryfikacji zamienić powyższą linię na poniższą.
    # add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" always;

    # ---------- Ukrycie wersji oprogramowania ----------
    server_tokens off;
    fastcgi_hide_header X-Powered-By;
    proxy_hide_header   X-Powered-By;
    proxy_hide_header   X-Page-Speed;

    # ---------- Blokada wrażliwych ścieżek ----------
    autoindex off;

    location ~ /\.(git|svn|hg|env|htaccess|htpasswd|DS_Store) { deny all; return 404; }
    location ~* \.(sql|sqlite|bak|backup|old|orig|save|swp|log|ini|conf|zip|tar|gz|7z|rar)$ { deny all; return 404; }
    location ~* ^/(composer\.(json|lock)|package(-lock)?\.json|yarn\.lock|phpinfo\.php|info\.php)$ { deny all; return 404; }

    # ---------- Ograniczenie tempa na formularzach (anty-spam / anty-brute-force) ----------
    # Definicja strefy należy do bloku http { } w nginx.conf:
    #   limit_req_zone $binary_remote_addr zone=formularze:10m rate=5r/m;
    location ~ ^/(contact|quote)/ {
        limit_req zone=formularze burst=3 nodelay;
        try_files $uri $uri/ /index.php?$args;
    }
}
```

### Ciasteczka — flagi (punkt 6 zakresu)

Docelowa postać nagłówka dla ciasteczka sesyjnego:

```
Set-Cookie: SESSID=...; Path=/; Secure; HttpOnly; SameSite=Lax
```

- **`Secure`** — ciasteczko wysyłane wyłącznie po HTTPS.
- **`HttpOnly`** — niedostępne dla JavaScriptu, co ogranicza skutki ataku XSS.
- **`SameSite=Lax`** — istotna ochrona przed CSRF; `Strict` jest bezpieczniejsze, ale
  bywa uciążliwe przy powrotach z zewnętrznych linków.

Ciasteczka analityczne (`_ga`, `_gid`, `_gcl_au`) **nie mogą** być ustawiane przed
uzyskaniem zgody. Zgodnie z RODO oraz art. 173 Prawa telekomunikacyjnego:

- GTM/GA4 wolno załadować **dopiero po** kliknięciu „Akceptuję" (albo w trybie
  Google Consent Mode v2 z domyślnym stanem `denied`),
- baner musi mieć przycisk **odrzucenia** równie łatwy jak przycisk akceptacji —
  sam „Akceptuję" i „X" to konfiguracja niezgodna z RODO,
- domyślny stan przed decyzją użytkownika to **brak zgody**.

Minimalna poprawna konfiguracja Consent Mode v2, umieszczana **przed** znacznikiem GTM:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage':             'denied',
    'ad_user_data':           'denied',
    'ad_personalization':     'denied',
    'analytics_storage':      'denied',
    'functionality_storage':  'granted',
    'security_storage':       'granted',
    'wait_for_update':        500
  });
</script>
<!-- dopiero tutaj znacznik GTM -->
```

---

## Uwagi końcowe

Raport zawiera **wyłącznie zweryfikowane ustalenia**. Braki w punktach 1–7 wynikają
z ograniczeń środowiska, w którym audyt uruchomiono, a nie z konfiguracji serwera —
i nie należy ich interpretować jako „brak zastrzeżeń". Po uruchomieniu skryptu
`audyt-uzupelniajacy.sh` i przesłaniu wyniku raport zostanie uzupełniony o pełną analizę
nagłówków, TLS, wystawionych plików, formularzy, ciasteczek i bibliotek JS.

Metodologia: testy wyłącznie pasywne, zgodnie z poleceniem. Nie wykonano ataków
siłowych, skanowania portów, prób logowania ani eksploitacji. Na serwerze nie
dokonano żadnych zmian.
