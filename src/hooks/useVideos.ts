import { useState, useEffect } from 'react';
import { VideoContentRow } from '../types';
import { youtubeService } from '../services/youtube';
import { aiChannels } from '../data/channels';

export const useVideos = () => {
  const [videoRows, setVideoRows] = useState<VideoContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const allChannelPromises = aiChannels.map(async (channel) => {
          const response = await youtubeService.getChannelVideos(channel.name);
          return {
            title: channel.name,
            videos: response.items,
          };
        });

        const newVideoRows = await Promise.all(allChannelPromises);

        // Filter out any channels that failed to load videos
        const successfulRows = newVideoRows.filter(row => row.videos && row.videos.length > 0);

        setVideoRows(successfulRows);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllVideos();
  }, []);

  return { videoRows, loading, error };
};

// Note: The search and trailer functionality will be re-implemented later
// to work with the new YouTube data source. For now, they are removed.