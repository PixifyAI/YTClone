import { Movie, TMDbResponse, TMDbVideoResponse } from '../types';
import { mockMovie } from '../utils/mock';

const generateMockMovies = (count: number, prefix: string): Movie[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockMovie,
    id: i + 1,
    title: `${prefix} Movie ${i + 1}`,
    name: `${prefix} Movie ${i + 1}`,
    poster_path: `/placeholder-movie.jpg`,
    backdrop_path: `/placeholder-backdrop.jpg`,
  }));
};

export const mockTrending: TMDbResponse = {
  page: 1,
  results: generateMockMovies(20, 'Trending'),
  total_pages: 1,
  total_results: 20,
};

export const mockPopularMovies: TMDbResponse = {
  page: 1,
  results: generateMockMovies(20, 'Popular'),
  total_pages: 1,
  total_results: 20,
};

export const mockPopularTV: TMDbResponse = {
  page: 1,
  results: generateMockMovies(20, 'Popular TV'),
  total_pages: 1,
  total_results: 20,
};

export const mockTopRated: TMDbResponse = {
  page: 1,
  results: generateMockMovies(20, 'Top Rated'),
  total_pages: 1,
  total_results: 20,
};

export const mockActionMovies: TMDbResponse = {
  page: 1,
  results: generateMockMovies(20, 'Action'),
  total_pages: 1,
  total_results: 20,
};

export const mockComedyMovies: TMDbResponse = {
    page: 1,
    results: generateMockMovies(20, 'Comedy'),
    total_pages: 1,
    total_results: 20,
};

export const mockDramaMovies: TMDbResponse = {
    page: 1,
    results: generateMockMovies(20, 'Drama'),
    total_pages: 1,
    total_results: 20,
};

export const mockHorrorMovies: TMDbResponse = {
    page: 1,
    results: generateMockMovies(20, 'Horror'),
    total_pages: 1,
    total_results: 20,
};

export const mockSearchResults: TMDbResponse = {
    page: 1,
    results: generateMockMovies(10, 'Search Result'),
    total_pages: 1,
    total_results: 10,
};

export const mockMovieVideos: TMDbVideoResponse = {
  id: 1,
  results: [
    {
      id: '1',
      key: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
      name: 'Official Trailer',
      site: 'YouTube',
      type: 'Trailer',
      published_at: '2024-01-01T00:00:00.000Z',
    },
  ],
};

export const mockTVVideos: TMDbVideoResponse = {
    id: 1,
    results: [
      {
        id: '1',
        key: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
        name: 'Official Trailer',
        site: 'YouTube',
        type: 'Trailer',
        published_at: '2024-01-01T00:00:00.000Z',
      },
    ],
  };

export const mockMovieDetails: Movie = {
    ...mockMovie,
    id: 1,
    title: 'Mock Movie Details',
    name: 'Mock Movie Details',
};

export const mockTVDetails: Movie = {
    ...mockMovie,
    id: 1,
    title: 'Mock TV Details',
    name: 'Mock TV Details',
};
