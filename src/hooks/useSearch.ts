import { useState, useMemo } from 'react';
import { VideoContentRow } from '../types';

export const useSearch = (videoRows: VideoContentRow[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = useMemo(() => {
    if (!searchQuery) {
      return videoRows;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    return videoRows.map(row => {
      const filteredVideos = row.videos.filter(video =>
        video.snippet.title.toLowerCase().includes(lowercasedQuery) ||
        video.snippet.description.toLowerCase().includes(lowercasedQuery)
      );
      return { ...row, videos: filteredVideos };
    }).filter(row => row.videos.length > 0);

  }, [searchQuery, videoRows]);

  return { searchQuery, setSearchQuery, filteredRows };
};
