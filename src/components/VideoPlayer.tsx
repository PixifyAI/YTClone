import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { YouTubeVideo } from '../types';
import { youtubeService } from '../services/youtube';

interface VideoPlayerProps {
  isOpen: boolean;
  video: YouTubeVideo | null;
  videoKey: string | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, video, videoKey, onClose }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyPress);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-auto bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center bg-gray-900">
          <h2 className="text-white text-lg font-semibold truncate">
            {video.snippet.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
            title="Close (ESC)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="aspect-video">
          {videoKey ? (
            <iframe
              src={youtubeService.getEmbedUrl(videoKey, true)}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
              title={video.snippet.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <p className="text-white">Video not available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;