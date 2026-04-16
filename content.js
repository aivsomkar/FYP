let enabled = true;

// Load initial state
chrome.storage.local.get('enabled', (data) => {
  enabled = data.enabled !== false;
});

// Listen for toggle from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_ENABLED') enabled = msg.value;
});

function handleAds() {
  if (!enabled) return;

  const video = document.querySelector('video');

  // 1. Click "Skip Ad" button if it's available
  const skipBtn = document.querySelector(
    '.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern'
  );
  if (skipBtn) {
    skipBtn.click();
    return;
  }

  // 2. Fast-forward non-skippable ads (mute + jump to end)
  const isAd = !!(
    document.querySelector('.ad-showing') ||
    document.querySelector('.ytp-ad-badge')
  );

  if (isAd && video && video.duration) {
    video.muted = true;
    video.playbackRate = 16;
    if (video.currentTime < video.duration - 0.1) {
      video.currentTime = video.duration - 0.1;
    }
  } else if (video && video.playbackRate !== 1) {
    // Restore normal playback once ad is done
    video.playbackRate = 1;
    video.muted = false;
  }

  // 3. Dismiss overlay/banner ads
  const overlayClose = document.querySelector('.ytp-ad-overlay-close-button');
  if (overlayClose) overlayClose.click();

  const banner = document.querySelector('#masthead-ad, ytd-banner-promo-renderer');
  if (banner) banner.remove();
}

setInterval(handleAds, 300);
