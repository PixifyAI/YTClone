import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { YouTubeVideo } from '../types';
import VideoCard from './VideoCard';

interface ContentRowProps {
  title: string;
  videos: YouTubeVideo[];
  onVideoSelect: (video: YouTubeVideo) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, videos, onVideoSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
        
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update scroll buttons after animation
      setTimeout(checkScrollability, 300);
    }
  };

  React.useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [videos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="relative group mb-8">
      {/* Row Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-16">
        {title}
      </h2>
      
      {/* Scroll Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        
        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        
        {/* Videos Grid */}
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 md:px-16 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {videos.map((video, index) => (
            <div key={video.id.videoId} className="flex-none w-48 md:w-56">
              <VideoCard
                video={video}
                onPlay={onVideoSelect}
                delay={index * 100}
              />
            </div>
          ))}
        </div>
      </div>
      

    </div>
  );
};

export default ContentRow;