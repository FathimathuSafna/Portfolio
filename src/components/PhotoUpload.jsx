import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PhotoUpload() {
  const containerRef = useRef(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Smooth perpetual levitation animation using GSAP
    const animation = gsap.to(el, {
      y: -12,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className="hero-right">
      <div className="photo-frame-container" ref={containerRef}>
        {/* Static decorative accent ring */}
        <div className="rotating-border"></div>

        {/* Circular photo frame */}
        <div className="photo-frame">
          {!imgFailed ? (
            <img 
              src="/profile.jpeg" 
              alt="Fathimathu Safna C S" 
              id="developer-photo" 
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="initials-avatar" id="avatar-fallback">FS</div>
          )}
        </div>
      </div>
    </div>
  );
}
