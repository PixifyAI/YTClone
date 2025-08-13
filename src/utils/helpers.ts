import { Movie } from '../types';
import { GENRE_MAP } from '../constants/genres';

// Format runtime from minutes to hours and minutes
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Format release date
export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

// Get genres from genre IDs
export const getGenres = (genreIds: number[]): string[] => {
  return genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
};

// Get movie title (handles both movies and TV shows)
export const getTitle = (movie: Movie): string => {
  return movie.title || movie.name || 'Unknown Title';
};

// Get release date (handles both movies and TV shows)
export const getReleaseDate = (movie: Movie): string => {
  return movie.release_date || movie.first_air_date || '';
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
};

// Get star rating from vote average
export const getStarRating = (voteAverage: number): number => {
  return Math.round((voteAverage / 10) * 5 * 2) / 2; // Convert to 5-star rating with 0.5 increments
};

// Check if image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  return url && !url.includes('null') && !url.includes('undefined');
};

// Generate random placeholder color
export const getPlaceholderColor = (seed: string): string => {
  const colors = [
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-red-900',
    'bg-blue-900',
    'bg-green-900',
    'bg-purple-900'
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if device is mobile
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

// Generate safe CSS class name from string
export const generateSafeClassName = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};