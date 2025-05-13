const consentBanner = document.getElementById('consent-banner');
const preferencesModal = document.getElementById('preferences-modal');
const logList = document.getElementById('log-list');
const languageSelect = document.getElementById('language-select');

const translations = {
  en: {
    message: "We use cookies to improve your experience. Do you consent to tracking?",
    accept: "Accept",
    reject: "Reject",
    preferences: "Preferences"
  },
  es: {
    message: "Usamos cookies para mejorar su experiencia. ¿Consiente el seguimiento?",
    accept: "Aceptar",
    reject: "Rechazar",
    preferences: "Preferencias"
  }
};

function updateLanguage(lang) {
  const t = translations[lang];
  document.querySelector('#consent-banner p').textContent = t.message;
  document.getElementById('accept-btn').textContent = t.accept;
  document.getElementById('reject-btn').textContent = t.reject;
}

languageSelect.addEventListener('change', (e) => {
  updateLanguage(e.target.value);
});

// Load preferences if they exist
const savedPrefs = JSON.parse(localStorage.getItem('cookiePrefs'));
if (savedPrefs !== null) {
  consentBanner.style.display = 'none';
  applyPreferences(savedPrefs);
}

updateLanguage(languageSelect.value);

document.getElementById('accept-btn').onclick = () => {
  const prefs = { functional: true, analytics: true, marketing: true };
  localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
  consentBanner.style.display = 'none';
  applyPreferences(prefs);
};

document.getElementById('reject-btn').onclick = () => {
  const prefs = { functional: true, analytics: false, marketing: false };
  localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
  consentBanner.style.display = 'none';
  applyPreferences(prefs);
};

function openPreferences() {
  preferencesModal.style.display = 'block';
}

function savePreferences() {
  const prefs = {
    functional: true,
    analytics: document.getElementById('analytics').checked,
    marketing: document.getElementById('marketing').checked
  };
  localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
  preferencesModal.style.display = 'none';
  consentBanner.style.display = 'none';
  applyPreferences(prefs);
}

function applyPreferences(prefs) {
  logList.innerHTML = '';
  if (prefs.analytics) {
    loadAnalytics();
    logTrackingEvent("Analytics tracking enabled.");
  } else {
    logTrackingEvent("Analytics tracking disabled.");
  }

  if (prefs.marketing) {
    loadMarketing();
    logTrackingEvent("Marketing tracking enabled.");
  } else {
    logTrackingEvent("Marketing tracking disabled.");
  }
}

function loadAnalytics() {
  const script = document.createElement('script');
  script.src = 'https://example.com/analytics.js';
  document.head.appendChild(script);
}

function loadMarketing() {
  const script = document.createElement('script');
  script.src = 'https://example.com/marketing.js';
  document.head.appendChild(script);
}

function logTrackingEvent(message) {
  const li = document.createElement('li');
  li.textContent = new Date().toLocaleTimeString() + ' - ' + message;
  logList.appendChild(li);
}
