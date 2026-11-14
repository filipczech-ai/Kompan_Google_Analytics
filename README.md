# Kompan — wyjścia bez presji

Statyczny landing page projektu edukacyjnego. HTML, CSS i JavaScript bez frameworków, zależności produkcyjnych, backendu i zewnętrznych skryptów. Wszystkie obrazy są lokalne.

## Uruchomienie

W katalogu repozytorium:

```sh
python3 -m http.server 8000 --directory strona
```

Otwórz http://localhost:8000. Pliki do publikacji to zawartość `strona/`. Ścieżki względne obsługują również hosting w podkatalogu. Publikacja HTTPS i konfiguracja rzeczywistych kont są kolejnymi krokami; lokalny podgląd nie jest publikacją.

## Zakres

- Katalog 3 fikcyjnych profili: Maja / Warszawa / 80 zł, Kamil / Kraków / 70 zł, Ola / Wrocław / 90 zł.
- Filtry miasto + płeć + aktywność, licznik i stan pusty; reset filtrów.
- Na telefonie jedna kolumna. Mechanizm „Pokaż więcej” obsługuje przyszłe rozszerzenie ponad 3 profile; przy 3 kartach nie jest potrzebny.
- Wybór profilu uzupełnia formularz i aktualizuje koszt. Koszt obejmuje czas, nie bilety/posiłki.
- Termin minimum 24 godziny od aktualnego momentu, minimum 2 pełne godziny, walidacja kontaktu i zasad.
- Sukces po pełnej walidacji, jeden na wyświetlenie, komunikat demonstracyjny, podsumowanie bez danych kontaktowych; brak żądań wysyłających formularz.
- Lokalne sygnały `dataLayer`, brak GA4, GTM, Meta i Clarity na tym etapie.
- Panel preferencji prywatności (localStorage zapisuje wyłącznie dwie wartości logiczne). To NIE jest wdrożenie CMP ani Consent Mode.

## Rozstrzygnięcia dokumentacji

Wymagania bazowego zadania mają pierwszeństwo wobec sprzecznych obietnic w specyfikacji Kompana:

1. Nie symulujemy wysłania SMS/e-maila fałszywym komunikatem. Nie ma płatności, rzeczywistej rezerwacji ani gwarancji odpowiedzi w 2h.
2. „Wróć do katalogu” nie resetuje blokady sukcesu. Kolejny test po odświeżeniu strony.
3. Nagłówek pochodzi z poprawionego raportu Spotkania 1, który odrzucał dłuższy nagłówek ze specyfikacji.
4. Brak fikcyjnych gwiazdek, opinii i oznaczeń „zweryfikowany” przedstawianych jako fakty. Zasady weryfikacji opisują planowaną usługę.
5. Zachowany rozbudowany formularz, bo jest istotny dla szczegółowego briefu, mimo sugestii 2–3 pól w ogólnej instrukcji. Uzasadnienie: wybór osoby, czasu i kosztu wymaga dodatkowych danych. Wymaga odnotowania w raporcie.
6. Hero prowadzi do katalogu, karty i nawigacja do formularza: wspólny cel to ukończenie demonstracji, ale hero ma pośredni krok zgodny z briefem Kompana.
7. Wybrano dozwolony wariant mobilny jednej kolumny zamiast karuzeli; poprawia dostępność klawiaturą i czytelność.
8. Świadome pominięcie żądania blokady kont: prototyp nie ma kont ani prawdziwej moderacji. Tekst nie obiecuje funkcji, które nie istnieją.

## Plan pomiaru

| Lokalny sygnał | Kiedy | Parametry | Docelowo |
| --- | --- | --- | --- |
| `cta_click` | Jeden rzeczywisty klik w CTA | `cta_location`: hero_btn / card_select / nav_btn; opcjonalnie `profile_id` | GA4 cta_click |
| `form_start` | Pierwsza zmiana pola; również świadomy wybór profilu uzupełniający select | `form_id`: form_rezerwacja_kompan | GA4 form_start |
| `lead_success` | Wyłącznie po pełnej walidacji, raz na wyświetlenie | `form_id` | GA4 generate_lead / Meta Lead |
| `catalog_filter_change` | Zmiana filtra lub reset | `filter_type`, `filter_value`, `results_count` | Rozszerzenie GA4 |
| `consent_update` | Zapis preferencji | analytics_storage, ad_storage | Lokalny sygnał do przyszłej integracji CMP |

Żadne imię zamawiającego, e-mail, telefon, termin ani treść pola nie trafiają do dataLayer, URL czy localStorage. `profile_id` oznacza fikcyjny produkt w katalogu, nie użytkownika. Formularz ma atrybut maskowania Clarity, ale maskowanie musi być zweryfikowane po prawdziwej instalacji.

`page_view` i `section_view` zostają do konfiguracji w GTM na spotkaniu 3. ID sekcji: `sec_hero`, `oferta`, `zasady`; ID formularza: `form_rezerwacja_kompan`; CTA: `cta-hero`, `cta-nav`, `cta-maja`, `cta-kamil`, `cta-ola`. Raport używał `sec_oferta` / `sec_zasady`: mapuj te parametry w GTM na elementy `#oferta` / `#zasady`.

Uwaga do progu 50% przez 1 sekundę: cały katalog na telefonie jest wyższy od ekranu i 50% jego wysokości może nigdy nie być widoczne. Przy wdrożeniu mierzyć zdefiniowany blok nagłówka oferty (i opisać to w raporcie) albo uzgodnić inną definicję ekspozycji. Widoczność nie dowodzi przeczytania. Clarity nie mierzy ruchu wzroku — scrollmapa mierzy głębokość przewijania.

## Następny etap

Opublikować HTTPS; utworzyć GA4 i GTM Web; wybrać CMP dla domeny. Dopiero potem wdrożyć narzędzia z blokowaniem do zgody, bez podwójnej instalacji GA4. Prawdziwe Meta PageView/Lead i odbiorcy, Clarity oraz testy transmisji po odmowie/częściowej/pełnej zgodzie i zmianie decyzji wymagają kont oraz kolejnych instrukcji. Panel demonstracyjny ich nie zastępuje.

Test z drugą parą i obserwacje ludzi pozostają do przeprowadzenia. Nie są zastąpione testami automatycznymi.

Źródła grafik: `strona/assets/SOURCES.md`. Dowody i raport techniczny: `dowody/` i `raport-spotkanie-2.md`.
