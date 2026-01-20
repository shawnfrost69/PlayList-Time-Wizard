function timeToSeconds(time) {
  const parts = time.split(":").map(Number);
  let seconds = 0;
  while (parts.length) {
    seconds = seconds * 60 + parts.shift();
  }
  return seconds;
}

function collectDurationsFromDOM() {
  const timeNodes = document.querySelectorAll(
    "ytd-thumbnail-overlay-time-status-renderer span"
  );

  const durations = [];
  timeNodes.forEach((el) => {
    const text = el.textContent.trim();
    if (/^\d+(:\d+)+$/.test(text)) {
      durations.push(timeToSeconds(text));
    }
  });

  return durations;
}

function getPlaylistData() {
  // Detect playlist ID from URL (watch OR playlist page)
  const url = new URL(window.location.href);
  const playlistId = url.searchParams.get("list");

  if (!playlistId) {
    return null;
  }

  // Collect durations from DOM
  const durations = collectDurationsFromDOM();

  // Estimate unavailable videos
  const totalVideoNodes = document.querySelectorAll(
    "ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer"
  ).length;

  const unavailableCount =
    totalVideoNodes > durations.length ? totalVideoNodes - durations.length : 0;

  return {
    durations,
    unavailableCount,
    totalVideos: totalVideoNodes || durations.length,
  };
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_PLAYLIST_DURATION") {
    const data = getPlaylistData();
    sendResponse(data);
  }
});
