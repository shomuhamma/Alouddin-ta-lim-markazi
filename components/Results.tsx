import React, { useState, useEffect } from 'react';
import AnimatedSection from './AnimatedSection';
import { XIcon } from './Icons';

const images = [
  { src: '/assets/post_1.jpg', alt: 'post_1.jpg' },
  { src: '/assets/post_2.jpg', alt: 'post_2.jpg' },
  { src: '/assets/post_3.jpg', alt: 'post_3.jpg' },
  { src: '/assets/post_4.jpg', alt: 'post_4.jpg' },
];

const Results: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  return (
    <>
      <AnimatedSection>
        <section id="natijalar" className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                Natijalar
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
              </h2>
              <p className="text-lg text-gray-600">O‘quvchilarimizning real natijalari</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  onClick={() => !imageErrors.has(idx) && setSelectedImage(img.src)}
                >
                  {/* Gradient Border */}
                  <div className="p-[2px] bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-300 rounded-3xl">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                      <div className="aspect-video relative overflow-hidden">
                        {imageErrors.has(idx) ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                            Rasm topilmadi: {img.alt}
                          </div>
                        ) : (
                          <>
                            <img
                              src={img.src}
                              alt={`Natija ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                              loading="lazy"
                              onError={() => handleImageError(idx)}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {/* Badge */}
                            <div className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-white/40 font-semibold text-gray-800">
                              Natija
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw]">
            <img
              src={selectedImage}
              alt=""
              className="w-full max-h-[85vh] object-contain object-top transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
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

export default Results;