import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 lg:sticky lg:top-24 items-start">
      
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible w-full md:w-20 lg:w-24 shrink-0 no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              activeIndex === idx ? "border-indigo-500 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image Viewport */}
      <div className="relative w-full aspect-[3/4] bg-[#111214] rounded-2xl overflow-hidden group border border-white/5">
        <button 
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 z-10 bg-[#2B2D31]/80 hover:bg-[#2B2D31] p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/5 text-zinc-300"
        >
          <Maximize2 className="h-5 w-5" />
        </button>

        <div 
          className="w-full h-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <motion.img
            ref={imgRef}
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={images[activeIndex]}
            alt={productName}
            className="w-full h-full object-cover origin-center transition-transform duration-200 ease-out"
            style={{
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              transform: isHovering ? "scale(1.8)" : "scale(1)"
            }}
          />
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111214] flex flex-col"
          >
            <div className="flex items-center justify-end p-6">
              <button 
                onClick={() => setIsFullscreen(false)}
                className="p-3 bg-[#2B2D31] hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
              <img 
                src={images[activeIndex]} 
                alt={productName} 
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
              />
            </div>
            
            {/* Modal Thumbnails */}
            <div className="flex justify-center gap-4 p-8 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-20 rounded-md overflow-hidden transition-all ${
                    activeIndex === idx ? "ring-2 ring-indigo-500 scale-110" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
