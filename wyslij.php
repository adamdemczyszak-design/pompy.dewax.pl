<?php
declare(strict_types=1);
/* Obsługa formularza wyceny — pompy.dewax.pl (nazwa.pl)
   Wysyła zgłoszenie na adres w $ODBIORCA. Nie zapisuje niczego na serwerze. */

$ODBIORCA = 'sprzedaz@dewax.pl';
$NADAWCA  = 'formularz@dewax.pl';   // musi być adresem w domenie dewax.pl (SPF)

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
$imie        = pole('imie', 100);
$email       = pole('email', 150);
$miejscowosc = pole('miejscowosc', 100);
$metraz      = pole('metraz', 10);
$telefon     = pole('telefon', 30);
$wiadomosc   = mb_substr(trim((string)($_POST['wiadomosc'] ?? '')), 0, 2000);
$ogrzewanie  = pole('ogrzewanie', 60);
$zgodaDane   = ($_POST['zgoda_dane'] ?? '') === 'tak';
$zgodaTel    = ($_POST['zgoda_telefon'] ?? '') === 'tak';

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
$tresc .= "\n" . str_repeat('-', 46) . "\n";
$tresc .= 'Wysłano: ' . date('Y-m-d H:i:s') . "\n";
$tresc .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '?') . "\n";

$naglowki  = "From: Formularz DEWAX <$NADAWCA>\r\n";
$naglowki .= "Reply-To: $imie <$email>\r\n";
$naglowki .= "Content-Type: text/plain; charset=UTF-8\r\n";
$naglowki .= "X-Mailer: PHP/" . phpversion();

$temat = '=?UTF-8?B?' . base64_encode("Wycena: $imie, $miejscowosc, $metraz m2") . '?=';

if (@mail($ODBIORCA, $temat, $tresc, $naglowki)) {
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
