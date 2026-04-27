const adBlockAlgorithms = [
  {
    id: 'removeDialog',
    run: () => {
      const removed = [];
      document.querySelectorAll(
        'tp-yt-paper-dialog[style-target="host"][role="dialog"][tabindex="-1"][style*="position: fixed; top: 242.25px; left: 270px;"]'
      ).forEach(el => {
        el.remove();
        removed.push(el);
      });
      return removed.length > 0;
    }
  },
  {
    id: 'skipVideoAd',
    run: () => {
      const ad = document.querySelector('.ad-showing');
      const video = document.querySelector('video');
      if (ad && video && video.duration > 0) {
        video.currentTime = video.duration;
        return true;
      }
      return false;
    }
  },
  {
    id: 'setYouTubeCookie',
    run: () => {
      if (!document.cookie.includes('VISITOR_INFO1_LIVE=oKckVSqvaGw')) {
        document.cookie = 'VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com';
        return true;
      }
      return false;
    }
  }
];

function tryAdBlocking() {
  for (const algo of adBlockAlgorithms) {
    try {
      if (algo.run()) {
        return true;
      }
    } catch (error) {
      console.warn(`Ad block algorithm failed: ${algo.id}`, error);
    }
  }
  return false;
}

let clearAdInterval;

function startAdSkipping() {
  clearAdInterval = setInterval(() => {
    tryAdBlocking();
  }, 500);
}

function stopAdSkipping() {
  if (clearAdInterval) {
    clearInterval(clearAdInterval);
    clearAdInterval = undefined;
  }
}

function initAdBlock() {
  if (chrome && chrome.storage) {
    chrome.storage.local.get(['adBlockEnabled'], (result) => {
      if (result.adBlockEnabled !== false) {
        tryAdBlocking();
        startAdSkipping();
      }
    });
  } else {
    console.warn('chrome.storage not available in content script');
  }
}

if (chrome && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleAdBlock') {
      if (message.enabled) {
        tryAdBlocking();
        startAdSkipping();
      } else {
        stopAdSkipping();
      }
    }
  });
} else {
  console.warn('chrome.runtime not available in content script');
}

initAdBlock();