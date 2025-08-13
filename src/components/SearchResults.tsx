import React from 'react';
import { X } from 'lucide-react';
import { Movie } from '../types';
import { tmdbService } from '../services/tmdb';
import { getTitle, formatReleaseDate } from '../utils/helpers';

interface SearchResultsProps {
  results: Movie[];
  loading: boolean;
  onMovieSelect: (movie: Movie) => void;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  onMovieSelect,
  onClose
}) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Search Results</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onMovieSelect(movie)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
                  alt={getTitle(movie)}
                  className="w-full h-80 object-cover group-hover:brightness-75 transition-all duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-movie.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {getTitle(movie)}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {formatReleaseDate(movie.release_date || movie.first_air_date || '')}
                  </p>
                  {movie.vote_average > 0 && (
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400 text-xs font-medium">
                        ★ {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center text-white text-lg mt-12">
            <p>No results found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;