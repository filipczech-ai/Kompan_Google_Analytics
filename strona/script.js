'use strict';
(() => {
  const $ = id => document.getElementById(id);
  window.dataLayer = window.dataLayer || [];
  // Only controlled identifiers and filter values enter this local queue. Never form values.
  const signal = (event, parameters = {}) => window.dataLayer.push({event, ...parameters});
  const profiles = [
    {id:'maja', name:'Maja', age:27, city:'Warszawa', gender:'woman', rate:80, image:'maja.jpg', style:'Kinomanka z ciekawością świata', tags:['Kino i kultura','Kawa i rozmowa'], activities:['culture','food','event'], description:'Lubię kino, które zostaje w głowie, i rozmowy, które nie muszą się spieszyć. Chętnie wybiorę się na wystawę albo kawę po seansie.'},
    {id:'kamil', name:'Kamil', age:31, city:'Kraków', gender:'man', rate:70, image:'kamil.jpg', style:'Spokojny rozmówca, dobry słuchacz', tags:['Planszówki','Sport i spacer'], activities:['games','sport','food'], description:'Planszówki traktuję jako dobry pretekst do spotkania, nie rywalizacji. Po pracy najchętniej ruszam na spacer albo odkrywam nowe kawiarnie.'},
    {id:'ola', name:'Ola', age:29, city:'Wrocław', gender:'woman', rate:90, image:'ola.jpg', style:'Otwarta na nowe miejsca i pomysły', tags:['Koncerty','Ramen i kawa'], activities:['culture','food','event','sport'], description:'Mały koncert, nowa ramenownia czy spacer nad rzeką? Lubię poznawać miasto i ludzi, bez sztywnego scenariusza i pośpiechu.'}
  ];
  const filters = {city:$('filter-city'), gender:$('filter-gender'), activity:$('filter-activity')};
  const form = $('form_rezerwacja_kompan');
  const fields = ['companion','activity','date','hours','name','phone','email','terms'];
  let started = false, completed = false, expanded = false;
  const touched = new Set();
  const mobile = matchMedia('(max-width: 767px)');
  const money = value => new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:0}).format(value);
  const selectedProfile = () => profiles.find(p => p.id === $('companion').value);
  function startForm() {
    if (!started && !completed) { started = true; signal('form_start',{form_id:form.id}); }
  }
  function renderProfiles() {
    const filtered = profiles.filter(p => (filters.city.value === 'all' || p.city === filters.city.value) && (filters.gender.value === 'all' || p.gender === filters.gender.value) && (filters.activity.value === 'all' || p.activities.includes(filters.activity.value)));
    const visible = mobile.matches && !expanded ? filtered.slice(0,3) : filtered;
    $('profiles').innerHTML = visible.map(p => `<article class="profile-card"><div class="profile-photo"><img src="assets/img/${p.image}" width="800" height="600" alt="Zdjęcie poglądowe fikcyjnego profilu ${p.name}" loading="lazy"><span class="city-badge">⌖ ${p.city}</span><span class="demo-badge">PROFIL DEMONSTRACYJNY</span></div><div class="profile-content"><div class="profile-title"><h3>${p.name}<span>, ${p.age}</span></h3><span class="rate">${p.rate} zł <small>/ godz.</small></span></div><p class="profile-style">${p.style}</p><div class="tags">${p.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}</div><p class="profile-description">${p.description}</p><button type="button" class="button" id="cta-${p.id}" data-profile="${p.id}" data-cta-location="card_select" aria-label="Wybierz osobę: ${p.name}, ${p.city}">Wybierz osobę <span aria-hidden="true">↗</span></button></div></article>`).join('');
    $('results-count').textContent = `Profile: ${filtered.length}`;
    $('empty-state').hidden = filtered.length > 0;
    $('show-more').hidden = !mobile.matches || expanded || filtered.length <= 3;
    return filtered.length;
  }
  for (const [type, select] of Object.entries(filters)) {
    select.addEventListener('change', () => {
      expanded = false;
      const count = renderProfiles();
      signal('catalog_filter_change',{filter_type:type,filter_value:select.value,results_count:count});
    });
  }
  $('reset-filters').addEventListener('click', () => {
    Object.values(filters).forEach(select => select.value = 'all');
    expanded = false;
    signal('catalog_filter_change',{filter_type:'reset',filter_value:'all',results_count:renderProfiles()});
    filters.city.focus({preventScroll:true});
  });
  $('show-more').addEventListener('click', () => {expanded = true; renderProfiles();});
  mobile.addEventListener('change',renderProfiles);
  profiles.forEach(p => $('companion').add(new Option(`${p.name} — ${p.rate} zł/h, ${p.city}`,p.id)));
  function updateCost() {
    const profile = selectedProfile(), hours = Number($('hours').value);
    const valid = Number.isSafeInteger(hours) && hours >= 2 && Number.isSafeInteger(hours * (profile?.rate || 1));
    $('cost-total').textContent = !profile ? 'Wybierz osobę' : valid ? money(hours * profile.rate) : 'Minimum 2 pełne godziny';
    $('cost-detail').textContent = profile && valid ? `${hours} godz. × ${money(profile.rate)}. Bilety i jedzenie osobno. W demonstracji bez opłat.` : 'Bez opłat w demonstracji. Bilety i jedzenie osobno.';
  }
  document.addEventListener('click', event => {
    const cta = event.target.closest('[data-cta-location]');
    if (!cta) return;
    signal('cta_click',{cta_location:cta.dataset.ctaLocation, ...(cta.dataset.profile ? {profile_id:cta.dataset.profile} : {})});
    if (cta.dataset.profile) {
      if (completed) { $('success').scrollIntoView({block:'center'}); $('success').focus({preventScroll:true}); return; }
      const previous = $('companion').value;
      $('companion').value = cta.dataset.profile;
      if (previous !== $('companion').value) startForm();
      $('companion').classList.add('selected');
      validate('companion'); updateCost();
      $('rezerwacja').scrollIntoView({block:'start'});
      $('companion').focus({preventScroll:true});
    }
  });
  // Round UP so the native picker does not offer a minute less than 24 hours away.
  function updateMinimumDate() {
    const future = new Date(Math.ceil((Date.now()+86400000)/60000)*60000);
    const local = new Date(future.getTime()-future.getTimezoneOffset()*60000);
    $('date').min = local.toISOString().slice(0,16);
  }
  function messageFor(id) {
    const field = $(id), value = field.value.trim();
    switch(id) {
      case 'companion': return selectedProfile() ? '' : 'Wybierz osobę z listy.';
      case 'activity': return field.selectedIndex > 0 ? '' : 'Wybierz rodzaj aktywności.';
      case 'date': {
        const timestamp = new Date(value).getTime();
        return value && Number.isFinite(timestamp) && timestamp >= Date.now()+86400000 ? '' : 'Wybierz termin z co najmniej 24-godzinnym wyprzedzeniem.';
      }
      case 'hours': return Number.isSafeInteger(Number(value)) && Number(value)>=2 && Number.isSafeInteger(Number(value)*100) ? '' : 'Podaj pełną liczbę godzin, minimum 2.';
      case 'name': return value.length>=2 ? '' : 'Wpisz fikcyjne imię (minimum 2 znaki).';
      case 'phone': return /^[0-9]{9}$/.test(value) ? '' : 'Wpisz 9 cyfr fikcyjnego numeru, bez prefiksu +48.';
      case 'email': return value && field.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Wpisz poprawny fikcyjny e-mail, np. test@example.com.';
      case 'terms': return field.checked ? '' : 'Zaakceptuj zasady demonstracji.';
      default: return '';
    }
  }
  function validate(id) {
    const error = messageFor(id);
    $(id+'-error').textContent = error;
    $(id).setAttribute('aria-invalid',String(Boolean(error)));
    return !error;
  }
  fields.forEach(id => {
    $(id).addEventListener('blur', () => {touched.add(id); validate(id);});
    for (const name of ['input','change']) $(id).addEventListener(name, () => {
      startForm();
      if (touched.has(id)) validate(id);
      if (id === 'companion' || id === 'hours') updateCost();
    });
  });
  $('date').addEventListener('focus',updateMinimumDate);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (completed) return;
    updateMinimumDate();
    const errors = fields.filter(id => {touched.add(id); return !validate(id);});
    if (errors.length) {
      $('form-error').textContent = 'Sprawdź zaznaczone pola. Demonstracja nie została zakończona.';
      $(errors[0]).focus(); return;
    }
    // Success occurs only after all validation, once per page. No fetch, storage or URL of form data.
    completed = true;
    $('submit-booking').disabled = true;
    const profile = selectedProfile();
    const summary = [['Numer demonstracji',`DEMO-${crypto.randomUUID().slice(0,8).toUpperCase()}`],['Wybrana osoba',`${profile.name} · ${profile.city}`],['Aktywność',$('activity').value],['Termin',new Intl.DateTimeFormat('pl-PL',{dateStyle:'long',timeStyle:'short'}).format(new Date($('date').value))],['Czas i koszt',`${$('hours').value} godz. · ${money(Number($('hours').value)*profile.rate)} (symulacja)`]];
    const list = $('success-summary');
    summary.forEach(([term,value]) => {const dt = document.createElement('dt'), dd = document.createElement('dd');dt.textContent = term;dd.textContent = value;list.append(dt,dd);});
    signal('lead_success',{form_id:form.id});
    form.reset();
    form.hidden = true;
    $('success').hidden = false;
    $('success').focus({preventScroll:true});
    $('success').scrollIntoView({block:'center'});
  });
  // Consent preferences only: no third-party scripts are installed in this stage.
  const consentKey = 'kompan-consent-v1';
  let consent = {analytics:false,marketing:false};
  try {const saved = JSON.parse(localStorage.getItem(consentKey)); if (saved) consent = {analytics:saved.analytics === true,marketing:saved.marketing === true};} catch { /* A disabled storage must not block the page. */ }
  function openConsent() {
    $('consent-analytics').checked = consent.analytics;
    $('consent-marketing').checked = consent.marketing;
    $('consent-dialog').showModal();
  }
  function saveConsent(analytics,marketing) {
    consent = {analytics,marketing};
    try {localStorage.setItem(consentKey,JSON.stringify(consent));} catch { /* Keep this session's choice in memory. */ }
    signal('consent_update',{analytics_storage:analytics?'granted':'denied',ad_storage:marketing?'granted':'denied'});
    $('consent-dialog').close();
  }
  // Cookiebot CMP integration: renew button & category revocation reload
  $('open-consent').addEventListener('click', () => {
    if (window.Cookiebot && typeof window.Cookiebot.renew === 'function') {
      window.Cookiebot.renew();
    } else {
      openConsent();
    }
  });

  window.addEventListener('CookiebotOnConsentReady', () => {
    if (!window.Cookiebot || !window.Cookiebot.consent) return;
    const current = {
      analytics: Boolean(window.Cookiebot.consent.statistics),
      marketing: Boolean(window.Cookiebot.consent.marketing)
    };
    const storageKey = 'kompan_cookiebot_consent_state';
    let previous = null;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) previous = JSON.parse(stored);
    } catch (e) {}

    const revoked = previous && (
      (previous.analytics && !current.analytics) ||
      (previous.marketing && !current.marketing)
    );

    try {
      sessionStorage.setItem(storageKey, JSON.stringify(current));
    } catch (e) {}

    if (revoked) {
      window.location.reload();
    }
  });
  $('consent-reject').addEventListener('click',()=>saveConsent(false,false));
  $('consent-all').addEventListener('click',()=>saveConsent(true,true));
  $('consent-save').addEventListener('click',()=>saveConsent($('consent-analytics').checked,$('consent-marketing').checked));
  $('open-rules').addEventListener('click',()=>$('rules-dialog').showModal());
  document.querySelectorAll('.close-dialog').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  // section_view will be implemented in GTM on the next stage: see docs for mobile threshold issue.
  renderProfiles(); updateMinimumDate(); updateCost();
  document.body.classList.add('js-ready');
})();
