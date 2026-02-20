import React from "react";

interface HeroProps {
  onOpenModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  const handleScrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("kurslar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20 pb-12 lg:pt-0 lg:pb-0"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white z-0"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* TEXT SECTION */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-6">
              Qabul davom etmoqda
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Kelajagingizni <span className="text-orange-500">bugun</span> boshlang
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-10">
              Alouddin_Talim_Markazi — bilim, natija va ishonch asosida yaratilgan
              zamonaviy ta’lim makoni.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onOpenModal}
                className="bg-orange-500 text-white font-bold py-4 px-10 rounded-2xl hover:bg-orange-600 transition"
              >
                Kursga yozilish
              </button>

              <a
                href="#kurslar"
                onClick={handleScrollToCourses}
                className="bg-white border-2 border-gray-100 font-bold py-4 px-10 rounded-2xl hover:border-orange-200 transition"
              >
                Kurslarni ko‘rish
              </a>
            </div>
          </div>

          {/* IMAGE SECTION — TO‘G‘RI JOY */}
          <div className="relative order-1 lg:order-2 z-20">
            <div className="relative w-full max-w-[500px] mx-auto">
              {/* Glassmorphism Card */}
              <div className="relative p-3">
                <div
                  className="hero-glass-card"
                  style={{
                    position: "relative",
                    width: 360,
                    height: 480,
                    borderRadius: 24,
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 60px rgba(255, 165, 0, 0.1)",
                  }}
                >
                  {/* Soft Glow Effect */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                      height: "40%",
                      background: "radial-gradient(ellipse at center, rgba(255, 165, 0, 0.15) 0%, transparent 70%)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  ></div>

                  {/* Image */}
                  <img
                    src="/assets/bitiruvchi.png"
                    alt="Bitiruvchi talaba sertifikat bilan"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      position: "relative",
                      zIndex: 1,
                    }}
                    loading="eager"
                  />
                </div>

                {/* Subtle Shadow */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "90%",
                    height: 20,
                    background: "radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                    zIndex: -1,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
