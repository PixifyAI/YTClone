import React, { useState, useEffect } from 'react';
import { Play, Info, VolumeX, Volume2 } from 'lucide-react';
import { Movie } from '../types';
import { tmdbService } from '../services/tmdb';
import { youtubeService } from '../services/youtube';
import { getTitle, truncateText, getGenres, formatReleaseDate } from '../utils/helpers';
import { useMovieTrailer } from '../hooks/useMovies';

interface HeroProps {
  movie: Movie | null;
  onPlayMovie: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlayMovie }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const { trailerKey } = useMovieTrailer(movie);

  useEffect(() => {
    // Auto-play trailer after component mounts
    const timer = setTimeout(() => {
      if (trailerKey) {
        setShowVideo(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [trailerKey]);

  if (!movie) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const backdropUrl = tmdbService.getBackdropUrl(movie.backdrop_path, 'original');
  const genres = getGenres(movie.genre_ids || []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {showVideo && trailerKey ? (
          <div className="relative w-full h-full">
            <iframe
              src={youtubeService.getEmbedUrl(trailerKey, true)}
              className="absolute inset-0 w-full h-full object-cover scale-150"
              style={{
                pointerEvents: 'none',
                transform: 'scale(1.2)'
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              frameBorder="0"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <>
            <img
              src={backdropUrl}
              alt={getTitle(movie)}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-backdrop.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-16">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {getTitle(movie)}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center space-x-4 mb-4 text-white/90">
              {movie.vote_average > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {formatReleaseDate(movie.release_date || movie.first_air_date || '') && (
                <span className="text-lg">
                  {formatReleaseDate(movie.release_date || movie.first_air_date || '')}
                </span>
              )}
              {movie.media_type && (
                <span className="bg-red-600 px-2 py-1 rounded text-sm font-medium uppercase">
                  {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
              {truncateText(movie.overview, 200)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onPlayMovie(movie)}
                className="flex items-center justify-center space-x-2 bg-white text-black px-8 py-3 rounded hover:bg-white/90 transition-colors font-semibold text-lg"
              >
                <Play className="h-6 w-6 fill-current" />
                <span>Play</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-gray-500/50 backdrop-blur-sm text-white px-8 py-3 rounded hover:bg-gray-500/70 transition-colors font-semibold text-lg">
                <Info className="h-6 w-6" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      {showVideo && trailerKey && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-24 right-8 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      )}

      {/* Gradient Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-5" />
    </div>
  );
};

export default Hero;