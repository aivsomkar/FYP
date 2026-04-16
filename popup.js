const toggle     = document.getElementById('toggle');
const card       = document.getElementById('card');
const ambient    = document.getElementById('ambient');
const dot        = document.getElementById('dot');
const statusText = document.getElementById('status-text');

function updateUI(enabled) {
  toggle.checked = enabled;
  card.classList.toggle('on', enabled);
  ambient.classList.toggle('on', enabled);
  dot.classList.toggle('on', enabled);
  statusText.classList.toggle('on', enabled);
  statusText.textContent = enabled ? 'Ad-free experience active' : 'Inactive';
}

// Load saved state (default ON)
chrome.storage.local.get('enabled', (data) => {
  updateUI(data.enabled !== false);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  updateUI(enabled);

  // Notify all YouTube tabs
  chrome.tabs.query({ url: '*://*.youtube.com/*' }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { type: 'SET_ENABLED', value: enabled }, () => {
        void chrome.runtime.lastError;
      });
    });
  });
});
