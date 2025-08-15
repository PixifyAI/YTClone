import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { YouTubeVideo } from '../types';
import { youtubeService } from '../services/youtube';

interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
  delay?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsHovered(true);
    }, 300); // A shorter delay for a more responsive feel
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(false);
  };

  const videoId = video.id.videoId;
  const title = video.snippet.title;
  const description = video.snippet.description;
  const channelTitle = video.snippet.channelTitle;
  const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-110 z-50' : 'scale-100'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Video Thumbnail */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {!imageLoaded && (
          <div className="w-full pb-[56.25%] bg-gray-800 animate-pulse" /> // 16:9 aspect ratio
        )}
        <img
          src={youtubeService.getThumbnailUrl(videoId, 'high')}
          alt={title}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-movie.jpg'; // A generic placeholder
            setImageLoaded(true);
          }}
        />

        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        <button
          onClick={() => onPlay(video)}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
            <Play className="h-8 w-8 text-white fill-current" />
          </div>
        </button>
      </div>

      {/* Expanded Info Card (simplified for videos) */}
      {isHovered && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 rounded-b-lg shadow-2xl p-3 border-t-2 border-red-600 z-50">
          <div className="space-y-1">
            <h3 className="text-white font-semibold text-sm line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-400">{channelTitle}</p>
            <p className="text-xs text-gray-400">{publishedAt}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;