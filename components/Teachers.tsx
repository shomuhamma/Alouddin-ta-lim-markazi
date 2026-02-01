
import React, { useState, useEffect } from 'react';
import AnimatedSection from './AnimatedSection';
import { XIcon } from './Icons';

const locations = [
  {
    src: '/assets/asosiy-filial.png',
  },
  {
    src: '/assets/filial.png',
  },
];

const Teachers: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  return (
    <>
      <AnimatedSection>
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Manzillarimiz</h2>
              <p className="text-md text-gray-600">Bizning filiallarimiz manzillari — quyida.</p>
            </div>

            {/* Red highlighted area wrapper kept minimal — images live inside */}
            <div className="mx-auto" style={{ maxWidth: 1100 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-[20px] overflow-hidden cursor-pointer"
                    style={{
                      borderRadius: 20,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                      background: '#ffffff',
                    }}
                    onClick={() => setSelectedImage(loc.src)}
                  >
                    <div style={{ width: '100%', height: 340, overflow: 'hidden' }}>
                      <img
                        src={loc.src}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                        }}
                        loading="eager"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedImage}
              alt=""
              className="max-w-full max-h-full object-contain transition-transform duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Teachers;