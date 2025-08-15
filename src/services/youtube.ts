import { YouTubeSearchResponse } from '../types';

class YouTubeService {
  /**
   * Fetches the 5 most recent videos for a given YouTube channel ID.
   * This function calls our own backend serverless function, which then calls the YouTube API.
   * This is done to keep the YouTube API key secure on the backend.
   * @param channelId The ID of the YouTube channel.
   * @returns A promise that resolves to a YouTubeSearchResponse object.
   */
  async getChannelVideos(channelName: string): Promise<YouTubeSearchResponse> {
    try {
      // The endpoint is our own serverless function.
      const response = await fetch(`/api/youtube?channelName=${encodeURIComponent(channelName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch channel videos:', errorData.details);
        throw new Error(`API error: ${errorData.error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      // Return a default structure in case of an error to prevent crashes.
      return { items: [], pageInfo: { totalResults: 0, resultsPerPage: 0 } };
    }
  }

  /**
   * Generates a YouTube embed URL for a given video ID.
   * @param videoId The ID of the YouTube video.
   * @param autoplay Whether the video should autoplay.
   * @returns The YouTube embed URL.
   */
  getEmbedUrl(videoId: string, autoplay: boolean = false): string {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: '1',
      controls: '1',
      modestbranding: '1',
      rel: '0',
      showinfo: '0'
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  /**
   * Generates a YouTube thumbnail URL for a given video ID.
   * @param videoId The ID of the YouTube video.
   * @param quality The desired quality of the thumbnail.
   * @returns The YouTube thumbnail URL.
   */
  getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
    let qualitySuffix = 'hqdefault.jpg'; // high quality
    if (quality === 'maxres') qualitySuffix = 'maxresdefault.jpg';
    if (quality === 'standard') qualitySuffix = 'sddefault.jpg';
    if (quality === 'medium') qualitySuffix = 'mqdefault.jpg';
    if (quality === 'default') qualitySuffix = 'default.jpg';

    return `https://i.ytimg.com/vi/${videoId}/${qualitySuffix}`;
  }
}

export const youtubeService = new YouTubeService();
export default youtubeService;