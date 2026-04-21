// Function to perform ad blocking (original methods)
function blockAds() {
  // Set cookie to skip ads (may not always work)
  document.cookie = "VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com";

  // Remove ad-related elements (selectors are brittle and may break with YouTube updates)
  const elementsToRemove = document.querySelectorAll('tp-yt-paper-dialog[style-target="host"][role="dialog"][tabindex="-1"][style*="position: fixed; top: 242.25px; left: 270px;"]');
  elementsToRemove.forEach(el => el.remove());

  // Click play button if paused (may interfere with user control)
  const playButton = document.querySelector('button.ytp-play-button');
  if (playButton) {
    playButton.click();
  }
}

// New ad-skipping algorithm (continuous check and skip)
let clearAdInterval; // To store the interval ID for clearing
function startAdSkipping() {
  const defined = v => v !== null && v !== undefined;
  clearAdInterval = setInterval(() => {
    const ad = [...document.querySelectorAll('.ad-showing')][0];
    if (defined(ad)) {
      const video = document.querySelector('video');
      if (defined(video)) {
        video.currentTime = video.duration;
      }
    }
  }, 500);
}

function stopAdSkipping() {
  if (clearAdInterval) {
    clearInterval(clearAdInterval);
    clearAdInterval = undefined;
  }
}

// Check initial state from storage and apply
if (chrome && chrome.storage) {
  chrome.storage.local.get(['adBlockEnabled'], (result) => {
    if (result.adBlockEnabled !== false) { // Default to enabled
      blockAds();
      startAdSkipping();
    }
  });
} else {
  console.warn('chrome.storage not available in content script');
}

// Listen for toggle messages from popup
if (chrome && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleAdBlock') {
      if (message.enabled) {
        blockAds();
        startAdSkipping();
      } else {
        stopAdSkipping();
      }
    }
  });
} else {
  console.warn('chrome.runtime not available in content script');
}