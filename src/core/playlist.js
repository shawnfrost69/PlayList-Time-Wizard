import { parseDuration } from "./utils.js";

export class Playlist {
  constructor(videos = []) {
    this.videos = videos;
  }

  getTotalDuration() {
    return this.videos.reduce((sum, v) => sum + v.duration, 0);
  }

  getFormattedDuration() {
    return parseDuration(this.getTotalDuration());
  }

  getDurationAtSpeed(speed) {
    return parseDuration(this.getTotalDuration() / speed);
  }
}
