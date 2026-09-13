# Raport tygodniowy z wyników generatora: jak go ustawić

Sesja Claude nie może założyć harmonogramu z dostępem do Windsor.ai i HubSpota (harmonogram
utworzony z sesji nie dostaje konektorów, sprawdzone 13.09.2026). Dlatego harmonogram zakłada
właściciel w claude.ai: **Routines → Nowa rutyna**, harmonogram „co poniedziałek 7:00”,
konektory **Windsor.ai** i **HubSpot**, środowisko z repozytorium `adamdemczyszak-design/pompy.dewax.pl`,
a jako polecenie wkleja tekst poniżej. Alternatywa bez harmonogramu: raz w tygodniu napisać
w sesji „zaktualizuj wyniki generatora”.

## Polecenie do wklejenia

```
Zadanie cotygodniowe dla repozytorium adamdemczyszak-design/pompy.dewax.pl (strona DEWAX, gruntowe pompy
ciepła): zaktualizuj wyniki generatora kreacji reklamowych Meta i wyślij właścicielowi krótki raport.
Przeczytaj najpierw CLAUDE.md oraz reklamy/generator/README.md (sekcja „Wyniki i koszt zapytania”).
Tylko odczyt danych: nie wykonuj żadnych akcji zapisu w Meta Ads (Windsor execute_action) ani w HubSpocie.
Jeśli nie masz dostępu do narzędzi Windsor.ai albo HubSpot (MCP), napisz to w raporcie jako pierwsze
zdanie i zakończ bez zmian w plikach.

Procedura:
1. Windsor.ai, konektor „facebook”, konto „955522616312255”: get_data z polami ad_id, ad_name, spend,
   impressions, link_clicks, actions_lead; date_from 2026-09-12, date_to dzisiejsza data; filtr
   [["campaign_id","eq","120248421653200027"]]. Drugie zapytanie z polami campaign_id, campaign_status,
   campaign_daily_budget, campaign_spend_cap, a trzecie z polami account_balance, amount_spent, spend_cap
   (kwoty w groszach; limit wydatków konta = spend_cap minus amount_spent).
2. HubSpot, search_crm_objects na objectType CONTACT: filtry createdate GTE "1789171200000" (12.09.2026)
   oraz hs_analytics_source EQ "PAID_SOCIAL"; właściwości createdate, hs_analytics_first_url,
   recent_conversion_event_name; limit 200. Lead z formularza strony = kontakt, którego
   recent_conversion_event_name zawiera „.zap”. Kod kreacji = wartość utm_content z hs_analytics_first_url.
   Mapowanie na klucze w wyniki.json: dzien-wiercenia = R1, dom-ktory-juz-stoi = R2, kotlownia = R3,
   karuzela = R4; kreacje z generatora mają klucz równy kodowi (np. h03-b2-c1, bud-1, rm-1). Kontakty
   z formularzy Lead Ads (adres facebook.com, bez utm_content) nie liczą się do żadnej kreacji.
3. Zapisz reklamy/generator/wyniki.json w dotychczasowym formacie (aktualizacja, zrodlo, uwaga, kreacje
   z polami nazwa, wyswietlenia, klikniecia = link_clicks, wydatki, leady). Zachowaj klucze R1–R4 z nazwami
   jak w obecnym pliku; dopisz klucze dla innych kodów, które pojawiły się w Meta (nazwa reklamy zaczyna się
   od kodu) albo w HubSpocie. Sprawdź poprawność JSON poleceniem node -e. Nie zmieniaj innych plików.
4. Git: git fetch origin main; git checkout -B main origin/main; commit tylko tego pliku z opisem
   „Generator: wyniki tygodniowe RRRR-MM-DD” i trailerami jak w historii repozytorium; git push origin main.
   Ten plik nie uruchamia wdrożenia strony na nazwa.pl.
5. Odśwież panel: narzędzie Artifact z url https://claude.ai/code/artifact/b3a08c51-5ae6-442c-91fd-a4bc80654711:
   najpierw action "read", potem publish z tym samym url, file_path wskazującym na pobrany index (bez zmian
   treści) i files {"wyniki.json": "reklamy/generator/wyniki.json"}. Jeśli publikacja się nie uda, napisz to
   w raporcie i nie przerywaj zadania.
6. Raport końcowy po polsku, krótko, bez pauz „—”, bez wykrzykników: tabela per reklama (wydatki, kliknięcia
   w link, leady, koszt zapytania = wydatki ÷ leady), suma, zmiana od poprzedniego tygodnia (porównaj
   z poprzednią wersją wyniki.json z git), ile zostało do limitu wydatków konta i do limitu kampanii
   (spend cap 2 000 zł), stan kampanii i budżet dzienny, która kreacja wygrywa, jedna konkretna
   rekomendacja (co wyłączyć, co dołożyć z generatora). Jeśli limit konta starczy na mniej niż 7 dni,
   napisz to w pierwszym zdaniu.
```
