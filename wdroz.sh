#!/usr/bin/env bash
# =====================================================================
#  Wdrożenie pompy.dewax.pl na nazwa.pl — skrypt etapowy
#
#  Uruchamiać NA WŁASNYM KOMPUTERZE (wymaga dostępu do FTP/SFTP nazwa.pl).
#
#  Etapy — wykonywać po kolei, każdy osobno:
#     ./wdroz.sh drzewo    krok 2  — pokazuje strukturę serwera, NIC nie zmienia
#     ./wdroz.sh kopia     krok 3  — pobiera pliki + zrzut bazy danych
#     ./wdroz.sh wgraj     krok 5  — czyści katalog i wgrywa nową stronę
#     ./wdroz.sh testy     krok 6  — weryfikacja przez HTTP
#
#  DANE LOGOWANIA: skrypt NIGDY ich nie zapisuje. Czyta je z ~/.netrc
#  albo pyta interaktywnie (hasło nie jest wyświetlane ani zapisywane
#  w historii powłoki).
# =====================================================================

set -euo pipefail

DOMENA="pompy.dewax.pl"
DATA="$(date +%F)"
KATALOG_KOPII="$HOME/Downloads/DEWAX_STRONA/backup_${DATA}"
ZRODLO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Pliki wchodzące w skład wdrożenia (reszta repo NIE jest wgrywana)
PLIKI_WDROZENIA=(index.html pompy.html dla-instalatorow.html wyslij.php podziekowanie.html 404.html .htaccess
                 polityka-prywatnosci.html og.jpg favicon.png favicon-32.png icon-192.png apple-touch-icon.png robots.txt sitemap.xml)
KATALOGI_WDROZENIA=(img css js)

c_ok()   { printf '\033[32m%s\033[0m\n' "$*"; }
c_uwaga(){ printf '\033[33m%s\033[0m\n' "$*"; }
c_zle()  { printf '\033[31m%s\033[0m\n' "$*"; }
naglowek(){ printf '\n\033[1m=== %s ===\033[0m\n' "$*"; }

# ---------------------------------------------------------------------
# Dane dostępowe
# ---------------------------------------------------------------------
wczytaj_dane() {
    if [ -f "$HOME/.netrc" ] && grep -q "nazwa.pl" "$HOME/.netrc" 2>/dev/null; then
        c_ok "Znaleziono wpis nazwa.pl w ~/.netrc — użyję go."
        HOST=$(awk '/machine.*nazwa\.pl/{print $2; exit}' "$HOME/.netrc")
        LOGIN=$(awk '/machine.*nazwa\.pl/{f=1} f&&/login/{print $2; exit}' "$HOME/.netrc")
        HASLO=$(awk '/machine.*nazwa\.pl/{f=1} f&&/password/{print $2; exit}' "$HOME/.netrc")
    else
        read -r -p "Host FTP/SFTP (np. ftp.nazwa.pl): " HOST
        read -r -p "Login: " LOGIN
        read -r -s -p "Hasło (nie będzie widoczne): " HASLO; echo
    fi
    [ -n "${HOST:-}" ] && [ -n "${LOGIN:-}" ] && [ -n "${HASLO:-}" ] || { c_zle "Brak kompletu danych."; exit 1; }

    PROTOKOL="ftp"
    if command -v ssh >/dev/null 2>&1 && timeout 6 bash -c "</dev/tcp/${HOST}/22" 2>/dev/null; then
        c_ok "Port 22 otwarty — używam SFTP (szyfrowane)."
        PROTOKOL="sftp"
    else
        c_uwaga "SFTP niedostępny — używam FTP. Hasło leci nieszyfrowane."
    fi
}

sprawdz_lftp() {
    command -v lftp >/dev/null 2>&1 && return 0
    c_zle "Brak lftp. Zainstaluj:"
    echo "   macOS:  brew install lftp"
    echo "   Ubuntu: sudo apt install lftp"
    exit 1
}

lftp_uruchom() {
    lftp -u "${LOGIN},${HASLO}" "${PROTOKOL}://${HOST}" <<LFTPEOF
set ssl:verify-certificate no
set ftp:ssl-allow yes
set net:max-retries 3
set net:timeout 20
$1
bye
LFTPEOF
}

# ---------------------------------------------------------------------
# KROK 2 — struktura serwera (tylko odczyt)
# ---------------------------------------------------------------------
etap_drzewo() {
    naglowek "KROK 2 — struktura serwera (nic nie jest zmieniane)"
    sprawdz_lftp; wczytaj_dane
    echo "Katalog główny:"
    lftp_uruchom "cls -l ."
    naglowek "Zawartość katalogów wyglądających na katalog domeny"
    for K in "/${DOMENA}" "/public_html" "/pompy" "/${DOMENA}/public_html" "/domains/${DOMENA}"; do
        echo "--- $K ---"
        lftp_uruchom "cls -l ${K}" 2>/dev/null || echo "   (nie istnieje)"
    done
    naglowek "CO DALEJ"
    echo "Znajdź katalog zawierający pliki starej strony (CakePHP: webroot/, config/, src/)."
    echo "Potem uruchom:  KATALOG_ZDALNY=/twoj/katalog ./wdroz.sh kopia"
}

# ---------------------------------------------------------------------
# KROK 3 — kopia zapasowa
# ---------------------------------------------------------------------
etap_kopia() {
    naglowek "KROK 3 — kopia zapasowa"
    [ -n "${KATALOG_ZDALNY:-}" ] || { c_zle "Ustaw KATALOG_ZDALNY, np.:"; echo "   KATALOG_ZDALNY=/pompy ./wdroz.sh kopia"; exit 1; }
    sprawdz_lftp; wczytaj_dane
    mkdir -p "${KATALOG_KOPII}/pliki"

    c_uwaga "Pobieram pliki z ${KATALOG_ZDALNY} — przy dużej stronie potrwa kilka minut."
    lftp_uruchom "mirror --verbose --parallel=3 ${KATALOG_ZDALNY} ${KATALOG_KOPII}/pliki"

    naglowek "3a. Zrzut bazy danych"
    APP_LOCAL=$(find "${KATALOG_KOPII}/pliki" -name "app_local.php" -o -name "app.php" 2>/dev/null | head -1)
    if [ -n "$APP_LOCAL" ]; then
        c_ok "Znaleziono konfigurację CakePHP: $APP_LOCAL"
        echo "Dane połączenia z bazą (do zrzutu przez phpMyAdmin lub mysqldump):"
        grep -A12 "'Datasources'" "$APP_LOCAL" 2>/dev/null \
            | grep -E "'(host|username|database|password)'" \
            | sed "s/^/     /" || echo "     (nie udało się odczytać — otwórz plik ręcznie)"
        echo
        c_uwaga "Zrzut bazy zrób w panelu: nazwa.pl → Bazy danych → phpMyAdmin → Eksport → SQL"
        echo "Zapisz jako: ${KATALOG_KOPII}/baza.sql"
    else
        c_uwaga "Nie znalazłem app_local.php. Zrzut bazy zrób ręcznie przez phpMyAdmin."
        echo "Zapisz jako: ${KATALOG_KOPII}/baza.sql"
    fi

    naglowek "3c. Galeria zdjęć"
    if [ -d "${KATALOG_KOPII}/pliki/webroot/uploads/galleries/big" ]; then
        c_ok "Galeria jest w kopii: webroot/uploads/galleries/big"
        find "${KATALOG_KOPII}/pliki/webroot/uploads/galleries/big" -type f | wc -l | xargs echo "   plików:"
    else
        c_uwaga "Nie znalazłem galerii w standardowej ścieżce — sprawdź kopię ręcznie."
    fi

    naglowek "PODSUMOWANIE KOPII"
    echo "Lokalizacja: ${KATALOG_KOPII}"
    echo "Plików:      $(find "${KATALOG_KOPII}/pliki" -type f 2>/dev/null | wc -l | tr -d ' ')"
    echo "Rozmiar:     $(du -sh "${KATALOG_KOPII}" 2>/dev/null | cut -f1)"
    if [ -f "${KATALOG_KOPII}/baza.sql" ]; then
        c_ok "baza.sql: $(du -h "${KATALOG_KOPII}/baza.sql" | cut -f1)"
    else
        c_zle "BRAK baza.sql — bez niego NIE URUCHAMIAJ etapu 'wgraj'."
    fi
}

# ---------------------------------------------------------------------
# KROK 5 — wgranie
# ---------------------------------------------------------------------
etap_wgraj() {
    naglowek "KROK 5 — wgranie nowej strony"
    [ -n "${KATALOG_ZDALNY:-}" ] || { c_zle "Ustaw KATALOG_ZDALNY."; exit 1; }

    # Twarde zabezpieczenie: bez kompletu kopii ani kroku dalej.
    # KOPIA_W_PANELU=tak — gdy kopia (pliki + baza) została zrobiona po stronie nazwa.pl
    # w panelu "Kopie zapasowe na żądanie" i nie ma jej na dysku lokalnym.
    if [ "${KOPIA_W_PANELU:-}" = "tak" ]; then
        c_uwaga "Pomijam kontrolę kopii lokalnej — deklarujesz kopię w panelu nazwa.pl."
        echo "Zanim potwierdzisz: panel nazwa.pl → Kopie zapasowe → sprawdź, że dzisiejsza"
        echo "kopia PLIKÓW i BAZY ma status 100% i mieści się w 14-dniowym okresie przechowywania."
    else
        [ -d "${KATALOG_KOPII}/pliki" ] || { c_zle "Brak kopii plików w ${KATALOG_KOPII}. Uruchom najpierw: ./wdroz.sh kopia"; echo "   albo, jeśli kopia jest w panelu nazwa.pl:  KOPIA_W_PANELU=tak KATALOG_ZDALNY=... ./wdroz.sh wgraj"; exit 1; }
        [ -f "${KATALOG_KOPII}/baza.sql" ] || { c_zle "Brak ${KATALOG_KOPII}/baza.sql. Zrób zrzut bazy przez phpMyAdmin."; exit 1; }
        c_ok "Kopia plików i baza.sql obecne."
    fi

    for P in "${PLIKI_WDROZENIA[@]}"; do
        [ -f "${ZRODLO}/${P}" ] || { c_zle "Brak pliku ${P} w ${ZRODLO}"; exit 1; }
    done
    c_ok "Komplet ${#PLIKI_WDROZENIA[@]} plików + katalog img/ ($(ls -1 "${ZRODLO}/img" | wc -l | tr -d ' ') plików)."

    naglowek "UWAGA — operacja nieodwracalna"
    echo "Katalog ${KATALOG_ZDALNY} na serwerze zostanie WYCZYSZCZONY,"
    echo "a w jego miejsce trafi nowa strona."
    read -r -p 'Wpisz WDRAZAM, aby kontynuować: ' POTWIERDZENIE
    [ "$POTWIERDZENIE" = "WDRAZAM" ] || { c_uwaga "Przerwane, nic nie zmieniono."; exit 0; }

    sprawdz_lftp; wczytaj_dane

    POLECENIA="set ssl:verify-certificate no
cd ${KATALOG_ZDALNY}
glob -a rm -r -f *
lcd ${ZRODLO}"
    for P in "${PLIKI_WDROZENIA[@]}"; do POLECENIA="${POLECENIA}
put ${P}"; done
    for K in "${KATALOGI_WDROZENIA[@]}"; do POLECENIA="${POLECENIA}
mirror -R ${K} ${K}"; done
    # Uprawnienia: pliki 644, katalogi 755
    POLECENIA="${POLECENIA}
chmod 755 img
glob chmod 644 *.html *.php *.txt *.xml *.jpg *.png
chmod 644 .htaccess
glob chmod 644 img/*"

    lftp_uruchom "$POLECENIA"

    naglowek "WERYFIKACJA — czy .htaccess faktycznie jest na serwerze"
    lftp_uruchom "cls -la ${KATALOG_ZDALNY}" | grep -E '\.htaccess' \
        && c_ok ".htaccess obecny." \
        || c_zle ".htaccess NIE został wgrany — bez niego nie ma HTTPS ani gzip."

    c_ok "Wgrywanie zakończone. Uruchom: ./wdroz.sh testy"
}

# ---------------------------------------------------------------------
# KROK 6 — testy
# ---------------------------------------------------------------------
etap_testy() {
    naglowek "KROK 6 — weryfikacja"
    printf '%-24s | %-8s | %s\n' "TEST" "WYNIK" "OCENA"
    printf '%s\n' "-------------------------|----------|---------------------------"

    ocena() { if [ "$1" = "$2" ]; then c_ok "OK"; else c_zle "BŁĄD (oczekiwano $2)"; fi; }
    sprawdz() {
        local nazwa="$1" oczekiwany="$2" wynik="$3"
        printf '%-24s | %-8s | ' "$nazwa" "$wynik"
        ocena "$wynik" "$oczekiwany"
    }

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "http://${DOMENA}" || echo 000)
    sprawdz "Przekierowanie HTTPS" "301" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}" || echo 000)
    sprawdz "Strona główna" "200" "$KOD"

    GZIP=$(curl -sI -H "Accept-Encoding: gzip" "https://${DOMENA}" | grep -ci 'content-encoding: gzip' || true)
    printf '%-24s | %-8s | ' "Kompresja gzip" "$GZIP"
    [ "$GZIP" -ge 1 ] && c_ok "OK" || c_uwaga "brak gzip (mod_deflate wyłączony?)"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}/img/hero_wide.webp" || echo 000)
    sprawdz "Zdjęcie WebP" "200" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}/img/logo.png" || echo 000)
    sprawdz "Logo" "200" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}/og.jpg" || echo 000)
    sprawdz "Podgląd linku" "200" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}/polityka-prywatnosci.html" || echo 000)
    sprawdz "Polityka prywatnosci" "200" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}/nie-ma-takiej-strony" || echo 000)
    sprawdz "Strona 404" "404" "$KOD"

    if curl -s "https://${DOMENA}/sitemap.xml" | head -1 | grep -q '<?xml'; then
        printf '%-24s | %-8s | ' "Mapa witryny" "xml"; c_ok "OK"
    else
        printf '%-24s | %-8s | ' "Mapa witryny" "-"; c_zle "BŁĄD"
    fi

    # POST — bez -I, zgodnie z uwagą o składni
    KOD=$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMENA}/wyslij.php" || echo 000)
    sprawdz "PHP żyje (GET)" "302" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
        -d "imie=&email=zle&miejscowosc=&metraz=abc&czas=9" "https://${DOMENA}/wyslij.php" || echo 000)
    sprawdz "Walidacja formularza" "422" "$KOD"

    KOD=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
        -d "bot-field=spam&imie=A&email=a@a.pl&miejscowosc=B&metraz=100&czas=9" "https://${DOMENA}/wyslij.php" || echo 000)
    sprawdz "Ochrona przed botem" "302" "$KOD"

    # Test poprawki: brak pola czas (symulacja wyłączonego JS) musi przejść dalej,
    # a nie zostać po cichu odrzucony
    KOD=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
        -d "imie=&email=zle&miejscowosc=&metraz=abc" "https://${DOMENA}/wyslij.php" || echo 000)
    printf '%-24s | %-8s | ' "Formularz bez JS" "$KOD"
    [ "$KOD" = "422" ] && c_ok "OK (walidacja działa, nie ucieka w 302)" \
                       || c_zle "BŁĄD — oczekiwano 422; zgłoszenia bez JS mogą ginąć"

    naglowek "DO ZROBIENIA RĘCZNIE"
    echo "1. Wyślij formularz z przeglądarki prawdziwymi danymi."
    echo "2. Sprawdź skrzynkę sprzedaz@dewax.pl ORAZ folder spam (brak DKIM/DMARC)."
    echo "3. Zgłoś sitemap.xml w Google Search Console."
}

case "${1:-}" in
    drzewo) etap_drzewo ;;
    kopia)  etap_kopia ;;
    wgraj)  etap_wgraj ;;
    testy)  etap_testy ;;
    *)
        echo "Wdrożenie pompy.dewax.pl — użycie:"
        echo "  ./wdroz.sh drzewo                          krok 2 — pokaż serwer (bezpieczne)"
        echo "  KATALOG_ZDALNY=/pompy ./wdroz.sh kopia     krok 3 — kopia plików + baza"
        echo "  KATALOG_ZDALNY=/pompy ./wdroz.sh wgraj     krok 5 — wgranie strony"
        echo "       dodaj KOPIA_W_PANELU=tak, jeśli kopia jest po stronie nazwa.pl"
        echo "  ./wdroz.sh testy                           krok 6 — weryfikacja"
        exit 1 ;;
esac
