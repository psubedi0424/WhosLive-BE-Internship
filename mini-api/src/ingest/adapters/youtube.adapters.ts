import youtubeData from '../fixtures/youtube.json';

export class youtubeAdapter {
  async fetchStreams() {
    return youtubeData.map((stream) => ({
      platform: 'youtube',
      streamId: stream.videoId,
      title: stream.title,
      viewers: stream.viewCount,
      creatorName: stream.channelName,
    }));
  }
}
