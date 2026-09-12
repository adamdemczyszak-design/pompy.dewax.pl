<?php
declare(strict_types=1);
/* Formularz "Wycena obiektu" - multilan (dewax.pl/multilan), hosting nazwa.pl.
   Sprawdza pola, odrzuca boty (pułapka + limit czasu), wysyła e-mail na $ODBIORCA.
   Odpowiada JSON (gdy strona wysyła przez fetch) albo przekierowuje na dziekujemy (bez JS).
   Etap 6: dopisać HubSpot (lead_source, rodzaj_obiektu, powierzchnia_m2). */

$ODBIORCA = 'biuro@dewax.pl';
$NADAWCA  = 'formularz@dewax.pl';   // adres w domenie dewax.pl (SPF), jak na pompy.dewax.pl
$BAZA     = '/multilan';

$json = (stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false)
     || (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch');

function odpowiedz(bool $ok, array $bledy = [], int $kod = 200): void {
    global $json, $BAZA;
    if ($json) {
        http_response_code($ok ? 200 : $kod);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'bledy' => (object)$bledy], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($ok) { header('Location: ' . $BAZA . '/dziekujemy'); exit; }
    http_response_code($kod);
    header('Content-Type: text/html; charset=utf-8');
    $lista = htmlspecialchars(implode(' ', array_values($bledy)), ENT_QUOTES, 'UTF-8');
    echo '<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>Uzupełnij formularz</title><style>body{font-family:"Open Sans",system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:0 24px;color:#2B2B2B;line-height:1.6}h1{color:#17006B}a{color:#17006B}</style></head>'
       . '<body><h1>Nie udało się wysłać</h1><p>' . $lista . '</p><p><a href="javascript:history.back()">Wróć do formularza</a></p></body></html>';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . $BAZA . '/'); exit; }

/* --- boty --- */
if (!empty($_POST['bot-field'])) odpowiedz(true);            // pułapka: udajemy sukces
$czas = (int)($_POST['czas'] ?? 0);                           // sekundy od wczytania strony, 0 = brak JS
if ($czas > 0 && $czas < 3) odpowiedz(false, ['_form' => 'Formularz wysłany zbyt szybko. Spróbuj ponownie.'], 400);

/* --- pola --- */
function pole(string $k, int $max): string {
    $v = trim((string)($_POST[$k] ?? ''));
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);   // blokada wstrzykiwania nagłówków
    return mb_substr($v, 0, $max);
}
$rodzaj  = pole('rodzaj_obiektu', 40);
$m2      = pole('powierzchnia_m2', 12);
$miasto  = pole('miejscowosc', 120);
$imie    = pole('imie_nazwisko', 120);
$firma   = pole('firma', 200);
$telefon = pole('telefon', 30);
$email   = pole('email', 200);
$uwagi   = mb_substr(trim((string)($_POST['uwagi'] ?? '')), 0, 3000);
$zgoda   = ($_POST['zgoda'] ?? '') === 'tak';
$zrodlo  = pole('lead_source', 60) ?: 'multilan.dewax.pl';

$bledy = [];
if (!in_array($rodzaj, ['klatka schodowa', 'elewacja', 'balkony i loggie', 'taras lub schody', 'inne'], true)) $bledy['rodzaj_obiektu'] = 'Wybierz rodzaj obiektu.';
if ($m2 !== '' && !(is_numeric($m2) && (float)$m2 > 0 && (float)$m2 < 1000000)) $bledy['powierzchnia_m2'] = 'Podaj liczbę większą od zera albo zostaw puste.';
if (mb_strlen($miasto) < 2)  $bledy['miejscowosc'] = 'Podaj miejscowość.';
if (mb_strlen($imie) < 3)    $bledy['imie_nazwisko'] = 'Podaj imię i nazwisko.';
if (strlen(preg_replace('/\D/', '', $telefon)) < 9) $bledy['telefon'] = 'Podaj numer telefonu (co najmniej 9 cyfr).';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $bledy['email'] = 'Podaj poprawny adres e-mail.';
if (!$zgoda) $bledy['zgoda'] = 'Zgoda jest wymagana, żebyśmy mogli oddzwonić.';
if ($bledy) odpowiedz(false, $bledy, 400);

/* --- e-mail --- */
$temat = 'Wycena obiektu: ' . $rodzaj . ($miasto !== '' ? ', ' . $miasto : '');
$tresc  = "Nowe zgłoszenie z formularza Wycena obiektu (dewax.pl/multilan)\n";
$tresc .= str_repeat('=', 60) . "\n\n";
$tresc .= "Rodzaj obiektu:     $rodzaj\n";
$tresc .= "Powierzchnia:       " . ($m2 !== '' ? $m2 . ' m²' : '- nie podano -') . "\n";
$tresc .= "Miejscowość:        $miasto\n";
$tresc .= "Imię i nazwisko:    $imie\n";
$tresc .= "Firma / wspólnota:  " . ($firma !== '' ? $firma : '- nie podano -') . "\n";
$tresc .= "Telefon:            $telefon\n";
$tresc .= "E-mail:             $email\n\n";
$tresc .= "Uwagi:\n" . ($uwagi !== '' ? $uwagi : '- brak -') . "\n\n";
$tresc .= str_repeat('-', 60) . "\n";
$tresc .= "Źródło: $zrodlo\nData: " . date('Y-m-d H:i:s') . "\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

$naglowki  = "From: Multilan formularz <$NADAWCA>\r\n";
$naglowki .= "Reply-To: $imie <$email>\r\n";
$naglowki .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
$tematKod  = '=?UTF-8?B?' . base64_encode($temat) . '?=';

$wyslano = @mail($ODBIORCA, $tematKod, $tresc, $naglowki, '-f' . $NADAWCA);
if (!$wyslano) $wyslano = @mail($ODBIORCA, $tematKod, $tresc, $naglowki);
if (!$wyslano) {
    error_log('multilan wyslij.php: mail() zwrocil false');
    odpowiedz(false, ['_form' => 'Nie udało się wysłać zgłoszenia. Zadzwoń: +48 509 815 112.'], 502);
}
odpowiedz(true);
