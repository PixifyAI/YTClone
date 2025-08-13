import { YouTubeSearchResponse, YouTubeVideo } from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!YOUTUBE_API_KEY) {
  console.warn('YouTube API key not found. Please set VITE_YOUTUBE_API_KEY or YOUTUBE_API_KEY.');
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
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('YouTube API request failed:', error);
      throw error;
    }
  }

  // Search for movie/TV show trailers
  async searchTrailers(query: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
    try {
      const searchQuery = `${query} official trailer`;
      const response = await this.makeRequest<YouTubeSearchResponse>('/search', {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: maxResults.toString(),
        order: 'relevance',
        videoDuration: 'medium',
        videoEmbeddable: 'true'
      });
      
      return response.items || [];
    } catch (error) {
      console.error('Failed to search YouTube trailers:', error);
      return [];
    }
  }

  // Get video details
  async getVideoDetails(videoId: string): Promise<any> {
    try {
      const response = await this.makeRequest<any>('/videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoId
      });
      
      return response.items?.[0] || null;
    } catch (error) {
      console.error('Failed to get YouTube video details:', error);
      return null;
    }
  }

  // Get trending movie trailers
  async getTrendingTrailers(): Promise<YouTubeVideo[]> {
    try {
      const response = await this.makeRequest<YouTubeSearchResponse>('/search', {
        part: 'snippet',
        q: 'movie trailer 2024 2025',
        type: 'video',
        maxResults: '20',
        order: 'relevance',
        publishedAfter: '2024-01-01T00:00:00Z',
        videoDuration: 'medium',
        videoEmbeddable: 'true'
      });
      
      return response.items || [];
    } catch (error) {
      console.error('Failed to get trending trailers:', error);
      return [];
    }
  }

  // Generate YouTube embed URL
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

  // Generate YouTube thumbnail URL
  getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }
}

export const youtubeService = new YouTubeService();
export default youtubeService;