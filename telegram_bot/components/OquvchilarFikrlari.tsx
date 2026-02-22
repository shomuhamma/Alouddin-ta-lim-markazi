import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './Icons';

const videos = [
  { src: '/assets/post_bir.mp4' },
  { src: '/assets/video_ikki.mp4' },
  { src: '/assets/video_uch.mp4' },
  { src: '/assets/video_tort.mp4' },
];

const OquvchilarFikrlari: React.FC = () => {
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleVideoError = (index: number) => {
    setVideoErrors(prev => new Set(prev).add(index));
  };

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        // Pause all others
        videoRefs.current.forEach((v, i) => {
          if (v && i !== index) {
            v.pause();
          }
        });
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handlePlay = (index: number) => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
      }
    });
  };

  const handleDoubleClick = (src: string) => {
    setSelectedVideo(src);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVideo]);

  return (
    <>
      <section id="oquvchilar-fikrlari" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O‘quvchilar fikrlari</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {videos.map((video, index) => (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer bg-white hover:scale-[1.02] transition-transform duration-300"
                onClick={() => !videoErrors.has(index) && handleVideoClick(index)}
                onDoubleClick={() => !videoErrors.has(index) && handleDoubleClick(video.src)}
              >
                <div className="aspect-[9/16] relative overflow-hidden bg-black rounded-3xl">
                  {videoErrors.has(index) ? (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">
                      Video topilmadi
                    </div>
                  ) : (
                    <>
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={video.src}
                        className="w-full h-full object-cover rounded-3xl"
                        controls
                        onPlay={() => handlePlay(index)}
                        onCanPlay={() => console.log(`Video loaded successfully: ${video.src}`)}
                        onError={() => {
                          console.error(`Video failed to load: ${video.src}`);
                          handleVideoError(index);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for full video */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-[90vw] max-h-[85vh]">
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OquvchilarFikrlari;