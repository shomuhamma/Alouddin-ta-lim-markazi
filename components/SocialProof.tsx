
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
}

const useInView = (ref: React.RefObject<HTMLElement>) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if(currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isInView;
};


const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const startTime = Date.now();
      const animate = () => {
        const currentTime = Date.now();
        const progress = Math.min(1, (currentTime - startTime) / duration);
        const currentCount = Math.floor(progress * (end - start) + start);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString('en-US')}</span>;
};


const stats = [
  { value: 1000, label: "kursni bitirgan o‘quvchilar", suffix: "+" },
  { value: 98, label: "kafolatlangan natija", suffix: "%" },
  { value: 5, label: "faoliyat tajribasi", suffix: " yil" },
];

const SocialProof: React.FC = () => {
  return (
    <section className="bg-white py-12 -mt-16 relative z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8">
                    {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                        <p className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-2">
                            <AnimatedCounter end={stat.value} />{stat.suffix}
                        </p>
                        <p className="text-md text-gray-600">{stat.label}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

export default SocialProof;