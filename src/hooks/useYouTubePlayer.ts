import { useState, useCallback } from 'react';
import { YouTubeVideo } from '../types';

export interface YouTubePlayerState {
  isOpen: boolean;
  video: YouTubeVideo | null;
}

export const useYouTubePlayer = () => {
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isOpen: false,
    video: null,
  });

  const openPlayer = useCallback((video: YouTubeVideo) => {
    setPlayerState({ isOpen: true, video });
  }, []);

  const closePlayer = useCallback(() => {
    setPlayerState({ isOpen: false, video: null });
  }, []);

  const videoKey = playerState.video?.id.videoId || null;

  return {
    playerState,
    videoKey,
    openPlayer,
    closePlayer,
  };
};
