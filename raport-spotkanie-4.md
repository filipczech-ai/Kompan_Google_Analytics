# Raport ze Spotkania 4 – Microsoft Clarity, Meta Pixel i Remarketing

**Projekt:** Kompan – usługa wynajmu towarzystwa  
**Data:** 22 listopada 2026  
**URL strony:** https://filipczech-ai.github.io/Kompan_Google_Analytics/strona/  
**GTM Container:** GTM-WWND9JMJ  
**GA4 Property:** G-EV6PLDTL68  

---

## 1. Microsoft Clarity – instalacja i konfiguracja

### Konfiguracja projektu Clarity
- **ID projektu:** `zhkz2jw3jr`
- **Dashboard:** https://clarity.microsoft.com
- **Maskowanie danych:** ustawione na **Strict** (maskuje wszystkie pola tekstowe i formularze – najwyższy poziom prywatności)

### Implementacja przez GTM
Zamiast wklejać skrypt Clarity bezpośrednio do HTML, zainstalowano go przez **Google Tag Manager** przy użyciu szablonu z galerii:

| Element GTM | Wartość |
|-------------|---------|
| Nazwa tagu | `Clarity – Official` |
| Typ tagu | Szablon z galerii GTM: *Microsoft Clarity* |
| Project ID | `zhkz2jw3jr` |
| Trigger | `CE – consent update` (zdarzenie `cookie_consent_update`) |
| Wymagana zgoda | `analytics_storage` |

### Uzasadnienie wymagania zgody
Microsoft Clarity tworzy identyfikator sesji i nagrywa zachowanie użytkownika – jest to analityka behawioralna. Dlatego wymaga `analytics_storage`. Bez akceptacji cookies analitycznych tag się nie uruchamia.

---

## 2. Meta Pixel – instalacja i zdarzenia

### Dane piksela
- **Pixel ID / Dataset ID:** `1132710476429499`
- **Nazwa piksela:** Kompan Pixel
- **Business Manager:** Meta Events Manager (facebook.com/events_manager2)

### Tag: META – base and PageView

| Element GTM | Wartość |
|-------------|---------|
| Nazwa tagu | `META – base and PageView` |
| Typ tagu | Custom HTML |
| Trigger | `CE – consent update` |
| Wymagana zgoda | `ad_storage`, `ad_user_data`, `ad_personalization` |

Kod tagu:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1132710476429499');
  fbq('track', 'PageView');
</script>
```

### Tag: META – Lead

| Element GTM | Wartość |
|-------------|---------|
| Nazwa tagu | `META – Lead` |
| Typ tagu | Custom HTML |
| Trigger | `CE – lead_success` |
| Wymagana zgoda | `ad_storage`, `ad_user_data`, `ad_personalization` |
| Kolejność tagów | Uruchamia się po `META – base and PageView` (tag sequencing) |

Kod tagu:
```html
<script>
  fbq('track', 'Lead');
</script>
```

### Weryfikacja Meta Pixel
Zdarzenia zweryfikowano za pomocą **Meta Pixel Helper** (rozszerzenie Chrome):
- ✅ `PageView` – status: **Wysłano zdarzenie**
- ✅ `Lead` – status: **Wysłano zdarzenie**

Zdarzenia widoczne w Meta Events Manager jako **fired** (aktywne).

---

## 3. Macierz zgód (Consent Matrix)

Poniżej wyniki testu – które tagi uruchamiają się w zależności od zgody użytkownika:

| Tag | Brak zgody | Tylko Analytics | Tylko Marketing | Pełna zgoda |
|-----|-----------|-----------------|-----------------|-------------|
| Cookiebot CMP | ✅ zawsze | ✅ zawsze | ✅ zawsze | ✅ zawsze |
| GA4 – Google tag | ❌ | ✅ | ❌ | ✅ |
| GA4 – zdarzenia | ❌ | ✅ | ❌ | ✅ |
| Microsoft Clarity | ❌ | ✅ | ❌ | ✅ |
| META – base and PageView | ❌ | ❌ | ✅ | ✅ |
| META – Lead | ❌ | ❌ | ✅ | ✅ |

> **Uwaga:** Cookiebot kontroluje wszystkie zgody. Żaden tag marketingowy nie uruchamia się bez `ad_storage`. Żaden tag analityczny nie uruchamia się bez `analytics_storage`.

---

## 4. Grupa remarketingowa w Meta Ads

### Definicja grupy (Custom Audience – Website)

| Parametr | Wartość |
|----------|---------|
| Nazwa grupy | `P1 – LP 30d bez Lead 30d` |
| Typ | Custom Audience → Website |
| Piksel | Kompan Pixel (ID: 1132710476429499) |
| Inkluzja | Odwiedzający URL zawierający `/Kompan_Google_Analytics/strona/` w ciągu ostatnich **30 dni** |
| Ekskluzja | Użytkownicy z eventem `Lead` w ciągu ostatnich **30 dni** |
| Cel | Remarketing do osób, które odwiedziły stronę, ale nie wypełniły formularza |

### Uzasadnienie

Wykluczenie osób, które wysłały formularz (Lead), pozwala skupić budżet reklamowy na użytkownikach, którzy znają już ofertę Kompan, ale jeszcze się nie zdecydowali. Unikamy też wielokrotnego wyświetlania reklamy tym, którzy już skontaktowali się z usługą.

---

## 5. Kreacja reklamowa – Wariant A

Wybrany wariant reklamy: **Wariant A** – pozytywny, skupiony na dobrej atmosferze i towarzystwie.

### Nagłówek
> **Dobry czas, dobra energia – znajdź swojego Kompana!**

### Tekst reklamy
> Czujesz, że brakuje Ci kogoś do rozmowy, wspólnego wyjścia czy po prostu dobrego towarzystwa? Z **Kompan** możesz to zmienić.  
> Nasi Kompanowie to prawdziwi ludzie – pełni energii, życzliwi i gotowi na wspólne chwile. Bez zobowiązań, w Twoim tempie, na Twoich zasadach.  
> 🎉 Koleżeńska atmosfera gwarantowana.

### Call to Action
> **Poznaj swojego Kompana →**

### Uzasadnienie wyboru Wariantu A
- Podkreśla **korzyść emocjonalną** – dobry czas i dobrą energię
- Buduje **zaufanie** bez wywierania presji
- Nie wspomina o cenach ani możliwości odwołania spotkania – skupia się na pozytywnym doświadczeniu
- Pasuje do grupy remarketingowej: przypomina o ofercie w przyjaznym tonie

---

## 6. Stan implementacji GTM (Spotkanie 4)

Wszystkie 10 tagów opublikowanych i zweryfikowanych w Tag Assistant:

| # | Tag | Status |
|---|-----|--------|
| 1 | Cookiebot CMP | ✅ fired |
| 2 | GA4 – Google tag | ✅ fired |
| 3 | GA4 – Event cta_click | ✅ fired |
| 4 | GA4 – Event form_start | ✅ fired |
| 5 | GA4 – Event generate_lead | ✅ fired |
| 6 | GA4 – Event section_view | ✅ fired |
| 7 | Clarity – Official | ✅ fired |
| 8 | META – base and PageView | ✅ fired |
| 9 | META – Lead | ✅ fired |

**GTM Export:** `gtm/GTM-WWND9JMJ_workspace.json` (workspace5, 87 517 bajtów)

---

## 7. Log decyzji AI

| Decyzja | Wybór | Uzasadnienie |
|---------|-------|--------------|
| Wariant kreacji | Wariant A | Pozytywny ton, skupienie na dobrej atmosferze; brak wzmianek o cenach i możliwości odwołania |
| Nazewnictwo grupy remarketingowej | `P1 – LP 30d bez Lead 30d` | Czytelna konwencja: priorytet, rodzaj strony, okno inkluzji, okno ekskluzji |
| Kolejność tagów Meta | Tag sequencing (Lead po base) | Zapewnia, że `fbq('init')` zawsze wywoła się przed `fbq('track', 'Lead')` |
| Maskowanie Clarity | Strict | Najwyższy poziom prywatności – dane w formularzach nie są nagrywane |

---

## 8. Dowody

| Dowód | Plik |
|-------|------|
| Tag Assistant – wszystkie tagi fired | `dowody/tag-assistant-all-fired.png` |
| Meta Pixel Helper – PageView + Lead | `dowody/meta-pixel-helper.png` |
| GA4 DebugView – zdarzenia | `dowody/ga4-debugview.png` |
| GTM Container Export | `gtm/GTM-WWND9JMJ_workspace.json` |

---

*Raport przygotowany automatycznie na podstawie rzeczywistej konfiguracji projektu.*
