/**
 * This file contains all the type definitions for the AIflix application.
 * It is focused on YouTube data structures.
 */

/**
 * Represents a single video item as returned by the YouTube API (search endpoint).
 */
export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title:string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
      medium: {
        url: string;
      };
      default: {
        url: string;
      };
    };
    publishedAt: string;
    channelTitle: string;
  };
}

/**
 * Represents the overall response from the YouTube API search endpoint.
 */
export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

/**
 * Represents a row of videos on the UI, typically for a single channel.
 */
export interface VideoContentRow {
  title: string;
  videos: YouTubeVideo[];
}

/**
 * Represents the state of the video player.
 */
export interface YouTubePlayerState {
  isOpen: boolean;
  video: YouTubeVideo | null;
}