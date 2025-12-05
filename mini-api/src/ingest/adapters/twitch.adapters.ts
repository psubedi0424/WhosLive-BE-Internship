import twitchData from '../fixtures/twitch.json';

export class twitchAdapter {
  async fetchStreams() {
    return twitchData.map((stream) => ({
      platform: 'twitch',
      streamId: stream.id,
      title: stream.title,
      viewers: stream.viewer_count,
      creatorName: stream.user_name,
    }));
  }
}
