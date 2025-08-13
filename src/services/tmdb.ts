import { TMDbResponse, TMDbVideoResponse, Movie } from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  console.warn('TMDb API key not found. Please set VITE_TMDB_API_KEY or TMDB_API_KEY.');
}

class TMDbService {
  private apiKey: string;

  constructor() {
    this.apiKey = TMDB_API_KEY || '';
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('TMDb API key is required');
    }

    const url = `${TMDB_BASE_URL}${endpoint}?api_key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TMDb API request failed:', error);
      throw error;
    }
  }

  // Get trending movies/TV shows
  async getTrending(mediaType = 'all', timeWindow = 'day'): Promise<Movie[]> {
    const response = await this.makeRequest<TMDbResponse>(`/trending/${mediaType}/${timeWindow}`);
    return response.results;
  }

  // Get popular movies
  async getPopularMovies(): Promise<Movie[]> {
    const response = await this.makeRequest<TMDbResponse>('/movie/popular');
    return response.results;
  }

  // Get popular TV shows
  async getPopularTVShows(): Promise<Movie[]> {
    const response = await this.makeRequest<TMDbResponse>('/tv/popular');
    return response.results;
  }

  // Get top rated movies
  async getTopRatedMovies(): Promise<Movie[]> {
    const response = await this.makeRequest<TMDbResponse>('/movie/top_rated');
    return response.results;
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    const response = await this.makeRequest<TMDbResponse>(`/discover/movie&with_genres=${genreId}`);
    return response.results;
  }

  // Get TV shows by genre
  async getTVShowsByGenre(genreId: number): Promise<Movie[]> {
    const response = await this.makeRequest<TMDbResponse>(`/discover/tv&with_genres=${genreId}`);
    return response.results;
  }

  // Search movies and TV shows
  async searchMulti(query: string): Promise<Movie[]> {
    const encodedQuery = encodeURIComponent(query);
    const response = await this.makeRequest<TMDbResponse>(`/search/multi&query=${encodedQuery}`);
    return response.results;
  }

  // Get movie videos (trailers, etc.)
  async getMovieVideos(movieId: number): Promise<TMDbVideoResponse> {
    return await this.makeRequest<TMDbVideoResponse>(`/movie/${movieId}/videos`);
  }

  // Get TV show videos
  async getTVVideos(tvId: number): Promise<TMDbVideoResponse> {
    return await this.makeRequest<TMDbVideoResponse>(`/tv/${tvId}/videos`);
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<Movie> {
    return await this.makeRequest<Movie>(`/movie/${movieId}`);
  }

  // Get TV show details
  async getTVDetails(tvId: number): Promise<Movie> {
    return await this.makeRequest<Movie>(`/tv/${tvId}`);
  }

  // Utility functions for image URLs
  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  getBackdropUrl(path: string, size: string = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  getOriginalImageUrl(path: string): string {
    if (!path) return '/placeholder-movie.jpg';
    return `${TMDB_IMAGE_BASE_URL}/original${path}`;
  }
}

export const tmdbService = new TMDbService();
export default tmdbService;