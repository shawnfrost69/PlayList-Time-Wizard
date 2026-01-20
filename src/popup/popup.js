import { Video } from "../core/video.js";
import { Playlist } from "../core/playlist.js";
import { SPEEDS } from "../constants/speeds.js";

/* ================= THEME LOGIC ================= */

const themeLink = document.getElementById("theme-style");
const themeSelect = document.getElementById("themeSelect");

// Load saved theme (or default)
chrome.storage.sync.get(["theme"], ({ theme }) => {
  const selectedTheme = theme || "glass";
  themeLink.href = `../themes/${selectedTheme}.css`;
  themeSelect.value = selectedTheme;
});

// Change + save theme
themeSelect.addEventListener("change", (e) => {
  const theme = e.target.value;
  themeLink.href = `../themes/${theme}.css`;
  chrome.storage.sync.set({ theme });
});

/* ================= DONATION MODAL ================= */

const donateBtn = document.getElementById("donateBtn");
const modal = document.getElementById("donateModal");
const closeModal = document.getElementById("closeModal");

donateBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

/* ================= PLAYLIST LOGIC ================= */

const totalEl = document.getElementById("total");
const speedsEl = document.getElementById("speeds");

function resetUI() {
  totalEl.textContent = "Calculating...";
  speedsEl.innerHTML = "";
}

resetUI();

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs || !tabs.length) {
    totalEl.textContent = "No active tab found.";
    return;
  }

  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "GET_PLAYLIST_DURATION" },
    (response) => {
      if (chrome.runtime.lastError) {
        totalEl.innerHTML =
          "⚠️ Playlist not detected.<br/>" +
          "<small>Click the playlist title or open the playlist page.</small>";
        return;
      }

      if (!response || !Array.isArray(response.durations)) {
        totalEl.textContent = "No playlist detected.";
        return;
      }

      const {
        durations,
        unavailableCount = 0,
        totalVideos = durations.length,
      } = response;

      if (durations.length === 0) {
        totalEl.textContent = "No playable videos found.";
        return;
      }

      // Build playlist from playable videos only
      const videos = durations.map((seconds) => new Video(seconds));
      const playlist = new Playlist(videos);

      // Render total duration
      totalEl.textContent = `Total: ${playlist.getFormattedDuration()}`;

      // Show unavailable/private info (if any)
      if (unavailableCount > 0) {
        const note = document.createElement("div");
        note.className = "note";
        note.textContent = `⚠️ ${unavailableCount} of ${totalVideos} video(s) unavailable or private`;
        speedsEl.appendChild(note);
      }

      // Render speed tiles
      SPEEDS.forEach((speed) => {
        const div = document.createElement("div");
        div.className = "tile";
        div.textContent = `${speed}x: ${playlist.getDurationAtSpeed(speed)}`;
        speedsEl.appendChild(div);
      });
    }
  );
});
