import { useState, useCallback } from 'react';
import { Movie, PlayerState } from '../types';
import { useMovieTrailer } from './useMovies';

export const useVideoPlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isOpen: false,
    videoKey: null,
    movie: null
  });

  const { trailerKey, loading } = useMovieTrailer(playerState.movie);

  const openPlayer = useCallback((movie: Movie, videoKey?: string) => {
    setPlayerState({
      isOpen: true,
      videoKey: videoKey || null,
      movie
    });
  }, []);

  const closePlayer = useCallback(() => {
    setPlayerState({
      isOpen: false,
      videoKey: null,
      movie: null
    });
  }, []);

  return {
    playerState,
    trailerKey,
    loading,
    openPlayer,
    closePlayer
  };
};