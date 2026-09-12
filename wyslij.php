<?php
declare(strict_types=1);
/* Obsługa formularza wyceny — pompy.dewax.pl (nazwa.pl)
   Wysyła zgłoszenie na adres w $ODBIORCA. Nie zapisuje niczego na serwerze. */

$ODBIORCA = 'sprzedaz@dewax.pl';
$NADAWCA  = 'formularz@dewax.pl';   // musi być adresem w domenie dewax.pl (SPF)

/* Lead do HubSpota: po wysłaniu maila zgłoszenie idzie też na webhook Make, a scenariusz Make
   tworzy lub aktualizuje kontakt w HubSpocie (bez tokenów HubSpota na serwerze).
   Adres webhooka nie jest w repozytorium: workflow wdrożenia zapisuje go z sekretu GitHub
   MAKE_WEBHOOK_LEADY do pliku konfig-leadow.php (zablokowanego w .htaccess). Bez pliku
   albo z pustym adresem ten krok jest pomijany, a mail działa jak dotąd. */
$MAKE_WEBHOOK = '';
@include __DIR__ . '/konfig-leadow.php';

function wyslij_lead_do_make(string $url, array $lead): void {
    if ($url === '' || !function_exists('curl_init')) return;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8'],
        CURLOPT_POSTFIELDS => json_encode($lead, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 5,
    ]);
    $odp = curl_exec($ch);
    $kod = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    if ($odp === false || $kod >= 300) error_log('pompy.dewax.pl lead -> Make: HTTP ' . $kod . ' ' . curl_error($ch));
    curl_close($ch);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: index.html'); exit; }

/* --- ochrona przed botami --- */
if (!empty($_POST['bot-field'])) { header('Location: podziekowanie.html'); exit; }
/* Wartość 0 oznacza, że JavaScript nie podmienił pola (błąd skryptu, wyłączony JS).
   Takiego zgłoszenia nie wolno odrzucić po cichu — to realny klient, nie bot.
   Odrzucamy wyłącznie wysyłki zmierzone jako podejrzanie szybkie: 1–2 sekundy. */
$czas = (int)($_POST['czas'] ?? 0);
if ($czas > 0 && $czas < 3) { header('Location: podziekowanie.html'); exit; }

/* --- pobranie i oczyszczenie danych --- */
function pole(string $k, int $max = 500): string {
    $v = trim((string)($_POST[$k] ?? ''));
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);   // blokada wstrzykiwania nagłówków
    return mb_substr($v, 0, $max);
}
function strona_bledu(int $kod, string $tytul, string $h1, string $tresc): void {
    http_response_code($kod);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $tytul . '</title>'
       . '<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:0 24px;color:#1C1C2E;line-height:1.65}'
       . 'h1{font-size:26px;color:#000050;margin-bottom:12px}a{color:#2F6D9E}</style></head><body>'
       . '<h1>' . $h1 . '</h1>' . $tresc . '</body></html>';
}

/* --- formularz zgody na publikację opinii (zgoda-na-publikacje-opinii.html) ---
   Ten sam kanał (mail na $ODBIORCA), osobny temat i osobna strona podziękowania
   (?zgoda=1, bez ?ok=1, żeby nie liczyć zgody jako konwersji wyceny). */
if (($_POST['formularz'] ?? '') === 'zgoda-opinia') {
    $imie        = pole('imie', 100);
    $nazwisko    = pole('nazwisko', 100);
    $email       = pole('email', 150);
    $telefon     = pole('telefon', 30);
    $miejscowosc = pole('miejscowosc', 100);
    $publikacja  = pole('publikacja', 30);
    $pokazMiejsc = ($_POST['pokaz_miejscowosc'] ?? '') === 'tak';
    $pokazDane   = ($_POST['pokaz_dane'] ?? '') === 'tak';
    $rok         = pole('rok', 10);
    $metraz      = pole('metraz', 10);
    $model       = pole('model', 80);
    $odwierty    = pole('odwierty', 80);
    $kwh         = pole('kwh', 20);
    $opinia      = mb_substr(trim((string)($_POST['opinia'] ?? '')), 0, 2000);
    $podpis      = pole('podpis', 150);
    $dataPodpisu = pole('data_podpisu', 20);
    $zgodaRodo   = ($_POST['zgoda_rodo'] ?? '') === 'tak';

    $bledy = [];
    if ($imie === '')                                          $bledy[] = 'imię';
    if ($nazwisko === '')                                      $bledy[] = 'nazwisko';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))            $bledy[] = 'poprawny e-mail';
    if ($miejscowosc === '')                                   $bledy[] = 'miejscowość instalacji';
    if (!in_array($publikacja, ['imie', 'imie-nazwisko'], true)) $bledy[] = 'sposób podpisania opinii';
    if ($opinia === '')                                        $bledy[] = 'treść opinii';
    if (!$zgodaRodo)                                           $bledy[] = 'zgoda na publikację';
    if ($podpis === '')                                        $bledy[] = 'podpis (imię i nazwisko)';
    if ($bledy) {
        strona_bledu(422, 'Uzupełnij formularz', 'Brakuje kilku danych',
            '<p>Uzupełnij: <b>' . htmlspecialchars(implode(', ', $bledy), ENT_QUOTES, 'UTF-8') . '</b>.</p>'
          . '<p><a href="javascript:history.back()">← Wróć do formularza</a></p>');
        exit;
    }

    $tresc  = "Zgoda na publikację opinii — pompy.dewax.pl\n";
    $tresc .= str_repeat('=', 46) . "\n\n";
    $tresc .= "Imię i nazwisko:   $imie $nazwisko\n";
    $tresc .= "E-mail:            $email\n";
    $tresc .= "Telefon:           " . ($telefon !== '' ? $telefon : '— nie podano —') . "\n";
    $tresc .= "Miejscowość:       $miejscowosc\n\n";
    $tresc .= "ZAKRES ZGODY\n";
    $tresc .= "Podpis na stronie: " . ($publikacja === 'imie-nazwisko' ? 'imię i nazwisko' : 'imię i pierwsza litera nazwiska') . "\n";
    $tresc .= "Miejscowość:       " . ($pokazMiejsc ? 'TAK, można podać' : 'NIE') . "\n";
    $tresc .= "Dane techniczne:   " . ($pokazDane ? 'TAK, można podać' : 'NIE') . "\n\n";
    $tresc .= "DANE INSTALACJI (podane przez klienta)\n";
    $tresc .= "Rok:               " . ($rok !== '' ? $rok : '—') . "\n";
    $tresc .= "Metraż:            " . ($metraz !== '' ? "$metraz m2" : '—') . "\n";
    $tresc .= "Model pompy:       " . ($model !== '' ? $model : '—') . "\n";
    $tresc .= "Odwierty:          " . ($odwierty !== '' ? $odwierty : '—') . "\n";
    $tresc .= "Prąd po sezonie:   " . ($kwh !== '' ? "$kwh kWh" : '—') . "\n\n";
    $tresc .= "OPINIA\n$opinia\n\n";
    $tresc .= "Podpis:            $podpis\n";
    $tresc .= "Data podpisu:      " . ($dataPodpisu !== '' ? $dataPodpisu : '—') . "\n";
    $tresc .= "\n" . str_repeat('-', 46) . "\n";
    $tresc .= 'Wysłano: ' . date('Y-m-d H:i:s') . "\n";
    $tresc .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '?') . "\n";

    $naglowki  = "From: Formularz DEWAX <$NADAWCA>\r\n";
    $naglowki .= "Reply-To: $imie $nazwisko <$email>\r\n";
    $naglowki .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $naglowki .= "X-Mailer: PHP/" . phpversion();
    $temat = '=?UTF-8?B?' . base64_encode("Zgoda na publikację opinii: $imie $nazwisko, $miejscowosc") . '?=';

    if (@mail($ODBIORCA, $temat, $tresc, $naglowki)) {
        header('Location: podziekowanie.html?zgoda=1');
    } else {
        strona_bledu(500, 'Błąd wysyłki', 'Nie udało się wysłać zgody',
            '<p>Przepraszamy. Wydrukuj formularz i oddaj ekipie albo napisz na <a href="mailto:sprzedaz@dewax.pl">sprzedaz@dewax.pl</a>.</p>'
          . '<p><a href="zgoda-na-publikacje-opinii.html">← Wróć do formularza</a></p>');
    }
    exit;
}

$imie        = pole('imie', 100);
$email       = pole('email', 150);
$miejscowosc = pole('miejscowosc', 100);
$metraz      = pole('metraz', 10);
$telefon     = pole('telefon', 30);
$wiadomosc   = mb_substr(trim((string)($_POST['wiadomosc'] ?? '')), 0, 2000);
$ogrzewanie  = pole('ogrzewanie', 60);
$zgodaDane   = ($_POST['zgoda_dane'] ?? '') === 'tak';
$zgodaTel    = ($_POST['zgoda_telefon'] ?? '') === 'tak';
/* atrybucja z ukrytych pól (utm z reklamy, strona wejścia, cookie HubSpota) */
$utmSource   = pole('utm_source', 60);
$utmMedium   = pole('utm_medium', 60);
$utmCampaign = pole('utm_campaign', 80);
$utmContent  = pole('utm_content', 80);   // kod kreacji z generatora, np. h01-b2-c3, albo nazwa reklamy
$stronaWe    = pole('strona_wejscia', 300);
$hutk        = preg_match('/^[a-f0-9]{32}$/', (string)($_POST['hutk'] ?? '')) ? (string)$_POST['hutk'] : '';

/* --- walidacja --- */
$bledy = [];
if ($imie === '')                                        $bledy[] = 'imię';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          $bledy[] = 'poprawny e-mail';
if ($miejscowosc === '')                                 $bledy[] = 'miejscowość';
if ($metraz !== '' && !ctype_digit($metraz))             $bledy[] = 'metraż jako sama liczba';
if (!$zgodaDane)                                         $bledy[] = 'zgoda na kontakt w sprawie zapytania';

if ($bledy) {
    http_response_code(422);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Uzupełnij formularz</title>'
       . '<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:0 24px;color:#1C1C2E;line-height:1.65}'
       . 'h1{font-size:26px;color:#000050;margin-bottom:12px}a{color:#2F6D9E}</style></head><body>'
       . '<h1>Brakuje kilku danych</h1><p>Uzupełnij: <b>' . htmlspecialchars(implode(', ', $bledy), ENT_QUOTES, 'UTF-8')
       . '</b>.</p><p><a href="javascript:history.back()">← Wróć do formularza</a></p></body></html>';
    exit;
}

/* --- treść wiadomości --- */
$tresc  = "Nowe zapytanie o wycenę — pompy.dewax.pl\n";
$tresc .= str_repeat('=', 46) . "\n\n";
$tresc .= "Imię:         $imie\n";
$tresc .= "E-mail:       $email\n";
$tresc .= "Telefon:      " . ($telefon !== '' ? $telefon : '— nie podano —') . "\n";
$tresc .= "Miejscowość:  $miejscowosc\n";
$tresc .= "Metraż:       " . ($metraz !== '' ? "$metraz m2" : '— nie podano —') . "\n";
$tresc .= "Zgoda tel.:   " . ($zgodaTel ? 'TAK — można dzwonić' : 'NIE — tylko e-mail') . "\n";
if ($ogrzewanie !== '') $tresc .= "Ogrzewanie:   $ogrzewanie\n";
if ($wiadomosc !== '')  $tresc .= "\nO domu:\n$wiadomosc\n";
if ($utmSource !== '' || $utmContent !== '') {
    $tresc .= "\nŹródło:       " . ($utmSource !== '' ? "$utmSource / $utmMedium" : '—') . "\n";
    $tresc .= "Kampania:     " . ($utmCampaign !== '' ? $utmCampaign : '—') . "\n";
    $tresc .= "Kreacja:      " . ($utmContent !== '' ? $utmContent : '—') . "\n";
}
$tresc .= "\n" . str_repeat('-', 46) . "\n";
$tresc .= 'Wysłano: ' . date('Y-m-d H:i:s') . "\n";
$tresc .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '?') . "\n";

$naglowki  = "From: Formularz DEWAX <$NADAWCA>\r\n";
$naglowki .= "Reply-To: $imie <$email>\r\n";
$naglowki .= "Content-Type: text/plain; charset=UTF-8\r\n";
$naglowki .= "X-Mailer: PHP/" . phpversion();

$temat = '=?UTF-8?B?' . base64_encode("Wycena: $imie, $miejscowosc, $metraz m2") . '?=';

if (@mail($ODBIORCA, $temat, $tresc, $naglowki)) {
    /* Lead do HubSpota przez Make (patrz komentarz przy $MAKE_WEBHOOK). Nie blokuje przekierowania:
       gdy Make nie odpowie w 5 s, klient i tak trafia na stronę podziękowania, a mail już wyszedł.
       Gotowe fragmenty JSON dla HubSpota (hs_upsert, hs_note_json) składamy tutaj, żeby cudzysłowy
       i nowe linie w wiadomości klienta nie rozbiły zapytań budowanych w Make. */
    $notatka = "Zapytanie o wycenę z pompy.dewax.pl\n"
        . "Metraż: " . ($metraz !== '' ? "$metraz m2" : 'nie podano') . "\n"
        . "Ogrzewanie: " . ($ogrzewanie !== '' ? $ogrzewanie : 'nie podano') . "\n"
        . "Zgoda na telefon: " . ($zgodaTel ? 'tak' : 'nie') . "\n"
        . ($wiadomosc !== '' ? "O domu: $wiadomosc\n" : '')
        . "Źródło: " . ($utmSource !== '' ? "$utmSource / $utmMedium" : 'bezpośrednio lub wyszukiwarka') . "\n"
        . "Kampania: " . ($utmCampaign !== '' ? $utmCampaign : 'brak') . "\n"
        . "Kreacja: " . ($utmContent !== '' ? $utmContent : 'brak') . "\n"
        . ($stronaWe !== '' ? "Strona wejścia: $stronaWe\n" : '')
        . "Wysłano: " . date('Y-m-d H:i');
    $wlasciwosci = ['email' => $email, 'firstname' => $imie, 'city' => $miejscowosc, 'message' => $notatka];
    if ($telefon !== '') $wlasciwosci['phone'] = $telefon;
    wyslij_lead_do_make($MAKE_WEBHOOK, [
        'hs_upsert'      => json_encode(['inputs' => [['idProperty' => 'email', 'id' => $email, 'properties' => $wlasciwosci]]], JSON_UNESCAPED_UNICODE),
        'hs_note_json'   => json_encode(nl2br(htmlspecialchars($notatka, ENT_QUOTES, 'UTF-8'), false), JSON_UNESCAPED_UNICODE),
        'formularz'      => 'wycena pompy.dewax.pl',
        'imie'           => $imie,
        'email'          => $email,
        'telefon'        => $telefon,
        'miejscowosc'    => $miejscowosc,
        'metraz'         => $metraz,
        'ogrzewanie'     => $ogrzewanie,
        'wiadomosc'      => $wiadomosc,
        'zgoda_dane'     => $zgodaDane,
        'zgoda_telefon'  => $zgodaTel,
        'utm_source'     => $utmSource,
        'utm_medium'     => $utmMedium,
        'utm_campaign'   => $utmCampaign,
        'utm_content'    => $utmContent,
        'kreacja'        => $utmContent,
        'strona_wejscia' => $stronaWe,
        'hutk'           => $hutk,
        'ip'             => $_SERVER['REMOTE_ADDR'] ?? '',
        'wyslano'        => date('c'),
    ]);
    /* ?ok=1 dostaje WYLACZNIE zgloszenie realnie wyslane mailem.
       Odrzucenia botow wyzej przekierowuja na te sama strone bez tego
       parametru, zeby nie liczyly sie jako konwersja w Google Ads. */
    header('Location: podziekowanie.html?ok=1');
} else {
    http_response_code(500);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Błąd wysyłki</title>'
       . '<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:0 24px;color:#1C1C2E;line-height:1.65}'
       . 'h1{font-size:26px;color:#000050;margin-bottom:12px}a{color:#2F6D9E}</style></head><body>'
       . '<h1>Nie udało się wysłać wiadomości</h1>'
       . '<p>Przepraszamy. Zadzwoń: <a href="tel:+48627413227"><b>62 741 32 27</b></a> '
       . 'albo napisz na <a href="mailto:sprzedaz@dewax.pl">sprzedaz@dewax.pl</a>.</p>'
       . '<p><a href="index.html">← Wróć na stronę</a></p></body></html>';
}
