// Get references to key DOM elements
const consentBanner = document.getElementById('consent-banner');         // The banner asking for cookie consent
const preferencesModal = document.getElementById('preferences-modal');   // Modal for selecting detailed preferences
const logList = document.getElementById('log-list');                     // A list to display logs or status updates
const languageSelect = document.getElementById('language-select');       // Dropdown to select the interface language

// Define translations for supported languages (English and Spanish)
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

// Function to update the banner text based on selected language
function updateLanguage(lang) {
  const t = translations[lang];  // Get translation object for selected language
  document.querySelector('#consent-banner p').textContent = t.message;
  document.getElementById('accept-btn').textContent = t.accept;
  document.getElementById('reject-btn').textContent = t.reject;
}

// Event listener: Update text when language is changed via dropdown
languageSelect.addEventListener('change', (e) => {
  updateLanguage(e.target.value);
});

// Load previously saved cookie preferences from localStorage
const savedPrefs = JSON.parse(localStorage.getItem('cookiePrefs'));
if (savedPrefs !== null) {
  consentBanner.style.display = 'none';  // Hide banner if preferences already exist
  applyPreferences(savedPrefs);          // Apply previously saved tracking settings
}

// Set language at page load based on current dropdown value
updateLanguage(languageSelect.value);

// Handle Accept button click
document.getElementById('accept-btn').onclick = () => {
  const prefs = { functional: true, analytics: true, marketing: true };  // Enable all
  localStorage.setItem('cookiePrefs', JSON.stringify(prefs));           // Save to localStorage
  consentBanner.style.display = 'none';                                 // Hide the banner
  applyPreferences(prefs);                                              // Apply the preferences
};

// Handle Reject button click
document.getElementById('reject-btn').onclick = () => {
  const prefs = { functional: true, analytics: false, marketing: false }; // Disable analytics & marketing
  localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
  consentBanner.style.display = 'none';
  applyPreferences(prefs);
};

// Open the preferences modal
function openPreferences() {
  preferencesModal.style.display = 'block';
}

// Save preferences from modal form
function savePreferences() {
  const prefs = {
    functional: true,
    analytics: document.getElementById('analytics').checked,  // Get analytics checkbox state
    marketing: document.getElementById('marketing').checked   // Get marketing checkbox state
  };
  localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
  preferencesModal.style.display = 'none';
  consentBanner.style.display = 'none';
  applyPreferences(prefs);
}

// Apply preferences and load or skip tracking scripts
function applyPreferences(prefs) {
  logList.innerHTML = '';  // Clear previous logs

  if (prefs.analytics) {
    loadAnalytics();                        // Inject analytics script
    logTrackingEvent("Analytics tracking enabled.");
  } else {
    logTrackingEvent("Analytics tracking disabled.");
  }

  if (prefs.marketing) {
    loadMarketing();                        // Inject marketing script
    logTrackingEvent("Marketing tracking enabled.");
  } else {
    logTrackingEvent("Marketing tracking disabled.");
  }
}

// Dynamically load the analytics script
function loadAnalytics() {
  const script = document.createElement('script');
  script.src = 'https://example.com/analytics.js';
  document.head.appendChild(script);
}

// Dynamically load the marketing script
function loadMarketing() {
  const script = document.createElement('script');
  script.src = 'https://example.com/marketing.js';
  document.head.appendChild(script);
}

// Display a log entry in the log list with timestamp
function logTrackingEvent(message) {
  const li = document.createElement('li');
  li.textContent = new Date().toLocaleTimeString() + ' - ' + message;
  logList.appendChild(li);
}
