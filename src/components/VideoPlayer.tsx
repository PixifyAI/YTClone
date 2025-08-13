import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Movie } from '../types';
import { youtubeService } from '../services/youtube';
import { getTitle, formatReleaseDate, getGenres } from '../utils/helpers';
import { tmdbService } from '../services/tmdb';

interface VideoPlayerProps {
  isOpen: boolean;
  movie: Movie | null;
  trailerKey: string | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, movie, trailerKey, onClose }) => {
  // Debug close function
  const handleClose = useCallback(() => {
    console.log('VideoPlayer: Close button clicked');
    onClose();
  }, [onClose]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowControls(true);
      hideControlsAfterDelay();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          if (isFullscreen) {
            exitFullscreen();
          } else {
            handleClose();
          }
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isFullscreen, handleClose]);

  const hideControlsAfterDelay = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    hideControlsAfterDelay();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !movie) {
    return null;
  }

  const genres = getGenres(movie.genre_ids || []);
  const releaseYear = formatReleaseDate(movie.release_date || movie.first_air_date || '');

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={playerRef}
        className="relative w-full h-full flex flex-col"
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => setShowControls(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Permanent Close Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-4 right-4 z-[70] p-3 bg-black/80 rounded-full hover:bg-black transition-colors"
          type="button"
          title="Close (ESC)"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        {/* Video Player */}
        <div className="relative flex-1 bg-black">
          {trailerKey ? (
            <iframe
              ref={iframeRef}
              src={youtubeService.getEmbedUrl(trailerKey, true)}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
              title={`${getTitle(movie)} Trailer`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
              <div className="text-center mb-8">
                <img
                  src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
                  alt={getTitle(movie)}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto mb-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-movie.jpg';
                  }}
                />
                <h2 className="text-white text-2xl font-bold mb-2">{getTitle(movie)}</h2>
                <p className="text-gray-400 text-lg mb-4">Trailer not available</p>
                <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">{movie.overview}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                  {getTitle(movie)}
                </h1>
                <div className="flex items-center space-x-4 text-white/80">
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  {releaseYear && <span>{releaseYear}</span>}
                  {movie.media_type && (
                    <span className="bg-red-600 px-2 py-1 rounded text-sm">
                      {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                    </span>
                  )}
                </div>
                {genres.length > 0 && (
                  <div className="flex space-x-2 mt-2">
                    {genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="bg-white/20 px-2 py-1 rounded text-white text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }}
                className="p-3 bg-black/70 rounded-full hover:bg-black/90 transition-colors z-[60] relative"
                type="button"
                title="Close (ESC)"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Center Play/Pause Button */}
          {trailerKey && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition-all transform hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12 text-white fill-current" />
                ) : (
                  <Play className="h-12 w-12 text-white fill-current" />
                )}
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="p-2 hover:bg-white/20 rounded transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white fill-current" />
                  )}
                </button>
                
                <button className="p-2 hover:bg-white/20 rounded transition-colors">
                  <SkipBack className="h-5 w-5 text-white" />
                </button>
                
                <button className="p-2 hover:bg-white/20 rounded transition-colors">
                  <SkipForward className="h-5 w-5 text-white" />
                </button>
                
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded transition-colors"
                >
                  <Maximize className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="relative bg-white/30 h-1 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;