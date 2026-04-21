document.cookie="VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com";

// UI Interface

const toggle = document.getElementById("toggle");
const pill = document.getElementById("statusPill");

toggle?.addEventListener("change", () => {
  if (toggle.checked) {
    pill.textContent = "Active";
  } else {
    pill.textContent = "Paused";
  }
});

// Refresh button
document.getElementById("refreshBtn")?.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    const tab = tabs[0];

    if (tab.url.includes("youtube.com")) {
      chrome.tabs.reload(tab.id);
    }
  });
});