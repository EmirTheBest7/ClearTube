// UI Interface
const toggle = document.getElementById("toggle");
const pill = document.getElementById("statusPill");

// Load initial state from storage
chrome.storage.local.get(['adBlockEnabled'], (result) => {
  const enabled = result.adBlockEnabled !== false; // Default to true
  toggle.checked = enabled;
  pill.textContent = enabled ? "Active" : "Paused";
});

// Handle toggle change
toggle?.addEventListener("change", () => {
  const enabled = toggle.checked;
  pill.textContent = enabled ? "Active" : "Paused";

  // Save to storage
  chrome.storage.local.set({ adBlockEnabled: enabled });

  // Send message to content script (if on YouTube tab)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length && tabs[0].url.includes("youtube.com")) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAdBlock', enabled });
    }
  });
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