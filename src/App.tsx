import React from 'react';
import Header from './components/Header';
import ContentRow from './components/ContentRow';
import VideoPlayer from './components/VideoPlayer';
import { useVideos } from './hooks/useVideos';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useSearch } from './hooks/useSearch';
import { YouTubeVideo } from './types';
import './index.css';

function App() {
  const { videoRows, loading, error } = useVideos();
  const { playerState, videoKey, openPlayer, closePlayer } = useYouTubePlayer();
  const { searchQuery, setSearchQuery, filteredRows } = useSearch(videoRows);

  const handleVideoSelect = (video: YouTubeVideo) => {
    openPlayer(video);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Loading AIflix</h2>
          <p className="text-gray-400">Fetching the latest AI videos...</p>
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
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Content Rows */}
      <div className="py-24">
        {filteredRows.map((row, index) => (
          <ContentRow
            key={`${row.title}-${index}`}
            title={row.title}
            videos={row.videos}
            onVideoSelect={handleVideoSelect}
          />
        ))}
        {filteredRows.length === 0 && !loading && (
          <div className="text-center text-white">No videos found.</div>
        )}
      </div>
      
      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={playerState.isOpen}
        video={playerState.video}
        videoKey={videoKey}
        onClose={closePlayer}
      />
    </div>
  );
}

export default App;