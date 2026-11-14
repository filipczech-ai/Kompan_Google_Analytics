# Kompan — dokumentacja budowy, spotkanie 2

Data prac: 14.11.2026. Zespół: do uzupełnienia przez autorów. Publiczny URL: jeszcze nie opublikowano. Lokalny podgląd: http://127.0.0.1:8000.

## Rezultat

Gotowy statyczny landing page w `strona/`, przygotowany do instalacji pomiaru na kolejnym spotkaniu. Zawiera hero z filtrami, katalog trzech fikcyjnych profili, zasady planowanej usługi, kroki działania, formularz demonstracyjny i panel lokalnych preferencji prywatności. Zdjęcia zapisane lokalnie, źródła w `strona/assets/SOURCES.md`.

Dokumenty wejściowe: opis projektu 00, projektowanie 01, budowa i testowanie 02, specyfikacja funkcjonalna Kompana oraz zaktualizowany raport Spotkania 1. Szczegółowe rozstrzygnięcia sprzeczności zapisano w README.

## Decyzje przy pracy z AI

Polecenie użytkownika: „przeanalizuj je i napisz kod (jest przygotowane repo Kompan) i tam pisz kod”, z uwzględnieniem trzech wcześniejszych instrukcji. Poniższy zapis przedstawia decyzje wykonawcze asystenta; własną ocenę zespołu należy dopisać po przeglądzie.

| Obszar | Propozycja / realizacja AI | Uzasadnienie | Weryfikacja |
| --- | --- | --- | --- |
| Struktura i treść | Układ katalogowy i poprawiony nagłówek z raportu; usunięcie fikcyjnych ocen i twierdzeń o rzeczywistej weryfikacji | Zachowanie kierunku briefu bez przedstawiania fikcji jako dowodów | Przegląd treści i zrzut desktop |
| UX i budowa | Automatyczny wybór osoby, koszt godzinowy, walidacja +24h, zablokowanie drugiego sukcesu | Wyraźne zakończenie demonstracji i spójność z instrukcją 02 | Testy poprawnego/błędnego formularza, podwójnego submitu i powrotu do katalogu |
| Pomiar | Lokalne lead_success mapowane później na generate_lead; wyłącznie stałe identyfikatory w kolejce | Rozdzielenie stanu strony od rzeczywistego pomiaru; brak danych kontaktowych | Zapis dataLayer i kontrola żądań sieciowych |
| Korekta wyglądu | Zastąpienie zdjęcia profilu Oli z niebieskim światłem zdjęciem w naturalnym świetle | Pierwszy wariant odbiegał od wytycznej spokojnego, naturalnego wyglądu | Powtórny przegląd zrzutów; stan sprzed poprawki w ZIP |

## Dowody i ich ograniczenia

- `dowody/desktop-1366.png`: pełny widok na szerokości 1366 px. Dowodzi renderowania konkretnego układu, nie wszystkich przeglądarek i urządzeń.
- `dowody/mobile-390.png`: pełny widok na szerokości 390 px. Dowodzi responsywnego układu w testowanej przeglądarce, nie testu na fizycznym telefonie.
- `dowody/formularz-bledy.png`: komunikaty błędów pustego formularza. Zrzut sam nie dowodzi braku zdarzenia — ten warunek sprawdza test automatyczny.
- `dowody/sukces.png`: demonstracyjne podsumowanie po poprawnej walidacji. Nie jest rezerwacją ani dowodem wysłania wiadomości.
- `dowody/dataLayer.json`: lokalne sygnały CTA, filtrów, rozpoczęcia i sukcesu. Nie dowodzi odbioru w GA4 ani Meta.
- `dowody/test-results.json`: faktyczny wynik uruchomienia automatycznych testów Chromium. Test preferencji dotyczy tylko lokalnego panelu; prawdziwe blokowanie narzędzi przez CMP wymaga dalszego wdrożenia.
- `dowody/baseline-przed-korekta.zip`: kopia strony przed korektą zdjęcia, do porównania zmian.

Automatyzacja testów: `tests/browser.cjs` (Node + Playwright; serwer lokalny musi działać). Opcjonalne `PLAYWRIGHT_EXECUTABLE_PATH` wskazuje zainstalowaną przeglądarkę; `NODE_PATH` można ustawić na lokalny katalog bibliotek. Te zależności służą wyłącznie testom — strona ich nie potrzebuje.

## Do wykonania przez parę

1. Przejrzeć stronę i wpisać własną ocenę decyzji AI.
2. Przekazać drugiej parze zadanie: „Sprawdź, czy oferta jest dla Ciebie, i zgłoś demonstracyjne zainteresowanie, używając danych fikcyjnych”.
3. Zapisać dwie rzeczywiste obserwacje bez interpretacji oraz hipotezę do jednej z nich. Nie przeprowadzono jeszcze testu z ludźmi; nie wymyślamy jego wyników.
4. Opublikować zawartość `strona/` na wybranym hostingu HTTPS, sprawdzić w innej przeglądarce i dopisać publiczny adres oraz skład zespołu.
5. Przygotować prawdziwe konta GA4, GTM, CMP oraz dostęp Meta i Clarity na kolejne zajęcia.

## Ograniczenia analizy

Testowe sukcesy nie są pozyskaniem klientów ani dowodem popytu. Przy tak małej liczbie fikcyjnych profili puste kombinacje filtrów są spodziewane. Rozbudowany formularz odpowiada specyfikacji Kompana, ale może zwiększać wysiłek użytkownika; to hipoteza do sprawdzenia podczas testu z drugą parą. Nie wnioskujemy o skuteczności konwersji bez rzeczywistej, właściwie zdefiniowanej populacji i działającego pomiaru.
