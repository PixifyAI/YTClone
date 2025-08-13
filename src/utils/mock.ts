import { Movie } from '../types';

export const mockMovie: Movie = {
  id: 1,
  title: 'Mock Movie',
  name: 'Mock Movie',
  overview: 'This is a mock movie used for testing and development purposes when the TMDB API key is not available. It showcases a fictional story about a brave developer who single-handedly saves a project from crashing.',
  poster_path: '/mock-poster.jpg',
  backdrop_path: '/mock-backdrop.jpg',
  release_date: '2024-01-01',
  first_air_date: '2024-01-01',
  vote_average: 8.5,
  genre_ids: [28, 35, 18, 27],
  media_type: 'movie',
  original_language: 'en',
  popularity: 1000,
  adult: false,
};
