import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ContentRow from './components/ContentRow';
import VideoPlayer from './components/VideoPlayer';
import { useMovies } from './hooks/useMovies';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import './index.css';

function App() {
  const { heroMovie, contentRows, loading, error } = useMovies();
  const { playerState, trailerKey, openPlayer, closePlayer } = useVideoPlayer();

  const handleMovieSelect = (movie: any) => {
    openPlayer(movie);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Loading Netflix</h2>
          <p className="text-gray-400">Fetching the latest movies and shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h2 className="text-white text-xl font-semibold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header onMovieSelect={handleMovieSelect} />
      
      {/* Hero Section */}
      <Hero movie={heroMovie} onPlayMovie={handleMovieSelect} />
      
      {/* Content Rows */}
      <div className="pb-16">
        {contentRows.map((row, index) => (
          <ContentRow
            key={`${row.endpoint}-${index}`}
            title={row.title}
            movies={row.movies}
            onMovieSelect={handleMovieSelect}
          />
        ))}
      </div>
      
      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={playerState.isOpen}
        movie={playerState.movie}
        trailerKey={trailerKey}
        onClose={closePlayer}
      />
    </div>
  );
}

export default App;