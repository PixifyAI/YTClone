import { useState, useEffect } from 'react';
import { Movie, ContentRow } from '../types';
import { tmdbService } from '../services/tmdb';
import { youtubeService } from '../services/youtube';

export const useMovies = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [contentRows, setContentRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all content in parallel
        const [trending, popularMovies, popularTV, topRated] = await Promise.all([
          tmdbService.getTrending(),
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTVShows(),
          tmdbService.getTopRatedMovies()
        ]);

        // Set hero movie (first trending movie with backdrop)
        const heroCandidate = trending.find(movie => movie.backdrop_path);
        if (heroCandidate) {
          setHeroMovie(heroCandidate);
        }

        // Organize content into rows
        const rows: ContentRow[] = [
          {
            title: 'Trending Now',
            movies: trending.slice(0, 20),
            endpoint: 'trending'
          },
          {
            title: 'Popular Movies',
            movies: popularMovies.slice(0, 20),
            endpoint: 'popular-movies'
          },
          {
            title: 'Popular TV Shows',
            movies: popularTV.slice(0, 20),
            endpoint: 'popular-tv'
          },
          {
            title: 'Top Rated',
            movies: topRated.slice(0, 20),
            endpoint: 'top-rated'
          }
        ];

        // Fetch genre-specific content
        try {
          const [actionMovies, comedyMovies, dramaMovies, horrorMovies] = await Promise.all([
            tmdbService.getMoviesByGenre(28), // Action
            tmdbService.getMoviesByGenre(35), // Comedy
            tmdbService.getMoviesByGenre(18), // Drama
            tmdbService.getMoviesByGenre(27)  // Horror
          ]);

          rows.push(
            {
              title: 'Action Movies',
              movies: actionMovies.slice(0, 20),
              endpoint: 'action'
            },
            {
              title: 'Comedy Movies',
              movies: comedyMovies.slice(0, 20),
              endpoint: 'comedy'
            },
            {
              title: 'Drama Movies',
              movies: dramaMovies.slice(0, 20),
              endpoint: 'drama'
            },
            {
              title: 'Horror Movies',
              movies: horrorMovies.slice(0, 20),
              endpoint: 'horror'
            }
          );
        } catch (genreError) {
          console.warn('Failed to fetch genre-specific content:', genreError);
        }

        setContentRows(rows);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  return { heroMovie, contentRows, loading, error };
};

export const useMovieTrailer = (movie: Movie | null) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie) {
      setTrailerKey(null);
      return;
    }

    const fetchTrailer = async () => {
      try {
        setLoading(true);
        
        // First try TMDb API for official trailers
        let videoKey: string | null = null;
        
        if (movie.media_type === 'tv' || movie.name) {
          const videos = await tmdbService.getTVVideos(movie.id);
          const trailer = videos.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          );
          videoKey = trailer?.key || null;
        } else {
          const videos = await tmdbService.getMovieVideos(movie.id);
          const trailer = videos.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          );
          videoKey = trailer?.key || null;
        }

        // If no TMDb trailer found, search YouTube
        if (!videoKey) {
          try {
            const movieTitle = movie.title || movie.name || '';
            const youtubeResults = await youtubeService.searchTrailers(movieTitle, 1);
            if (youtubeResults.length > 0) {
              videoKey = youtubeResults[0].id.videoId;
            }
          } catch (youtubeError) {
            console.warn('YouTube search failed:', youtubeError);
            // Continue without YouTube video
          }
        }

        setTrailerKey(videoKey);
      } catch (error) {
        console.error('Failed to fetch trailer:', error);
        setTrailerKey(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movie]);

  return { trailerKey, loading };
};

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await tmdbService.searchMulti(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchContent, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error
  };
};