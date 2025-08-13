import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Movie } from '../types';
import { tmdbService } from '../services/tmdb';
import { getTitle, formatReleaseDate, getGenres, truncateText } from '../utils/helpers';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  delay?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsHovered(true);
    }, 500); // Delay hover effect
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(false);
  };

  const genres = getGenres(movie.genre_ids || []);
  const releaseYear = formatReleaseDate(movie.release_date || movie.first_air_date || '');
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-110 z-50' : 'scale-100'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {!imageLoaded && (
          <div className="w-full h-64 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg" />
          </div>
        )}
        <img
          src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
          alt={getTitle(movie)}
          className={`w-full h-64 object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-movie.jpg';
            setImageLoaded(true);
          }}
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Play Button */}
        <button
          onClick={() => onPlay(movie)}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
            <Play className="h-8 w-8 text-white fill-current" />
          </div>
        </button>
      </div>
      
      {/* Expanded Info Card */}
      {isHovered && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 rounded-b-lg shadow-2xl p-4 border-t-2 border-red-600 z-50">
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPlay(movie)}
                className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
              >
                <Play className="h-4 w-4 text-black fill-current" />
              </button>
              <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <Plus className="h-4 w-4 text-white" />
              </button>
              <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <ThumbsUp className="h-4 w-4 text-white" />
              </button>
            </div>
            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <ChevronDown className="h-4 w-4 text-white" />
            </button>
          </div>
          
          {/* Movie Info */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-sm line-clamp-1">
              {getTitle(movie)}
            </h3>
            
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              {movie.vote_average > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {releaseYear && <span>{releaseYear}</span>}
              {movie.media_type && (
                <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                  {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                </span>
              )}
            </div>
            
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
            {movie.overview && (
              <p className="text-xs text-gray-400 line-clamp-2">
                {truncateText(movie.overview, 100)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;