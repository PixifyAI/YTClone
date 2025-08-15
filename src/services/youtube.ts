import { YouTubeSearchResponse } from '../types';

// WARNING: This key will be exposed in the frontend code.
// This is not a secure practice.
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!YOUTUBE_API_KEY) {
  console.error('YouTube API key is not found. Please set VITE_YOUTUBE_API_KEY in your .env file.');
}

class YouTubeService {
  private apiKey: string;

  constructor() {
    this.apiKey = YOUTUBE_API_KEY || '';
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('YouTube API key is required');
    }

    const urlParams = new URLSearchParams({
      key: this.apiKey,
      ...params
    });

    const url = `${YOUTUBE_BASE_URL}${endpoint}?${urlParams.toString()}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API Error:', errorData);
        throw new Error(`YouTube API error: ${errorData.error.message}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('YouTube API request failed:', error);
      throw error;
    }
  }

  async getChannelVideos(channelName: string): Promise<YouTubeSearchResponse> {
    try {
      // Step 1: Search for the channel by name to get its ID
      const channelSearch = await this.makeRequest<YouTubeSearchResponse>('/search', {
        part: 'snippet',
        q: channelName,
        type: 'channel',
        maxResults: '1',
      });

      if (!channelSearch.items || channelSearch.items.length === 0) {
        throw new Error(`Could not find channel: ${channelName}`);
      }
      const channelId = channelSearch.items[0].id.videoId; // Note: for channels, the search result gives videoId field for channelId

      // Step 2: Use the found channelId to get the latest videos
      const videoSearch = await this.makeRequest<YouTubeSearchResponse>('/search', {
        part: 'snippet',
        channelId: channelId,
        order: 'date',
        maxResults: '5',
      });

      return videoSearch;
    } catch (error) {
      console.error(`Failed to get videos for channel ${channelName}:`, error);
      return { items: [], pageInfo: { totalResults: 0, resultsPerPage: 0 } };
    }
  }

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

  getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
    let qualitySuffix = 'hqdefault.jpg';
    if (quality === 'maxres') qualitySuffix = 'maxresdefault.jpg';
    if (quality === 'standard') qualitySuffix = 'sddefault.jpg';
    if (quality === 'medium') qualitySuffix = 'mqdefault.jpg';
    if (quality === 'default') qualitySuffix = 'default.jpg';

    return `https://i.ytimg.com/vi/${videoId}/${qualitySuffix}`;
  }
}

export const youtubeService = new YouTubeService();
export default youtubeService;