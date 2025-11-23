import React, { useEffect, useRef } from 'react';

export const ShootingStars = ({
  starColor = '#FFFFFF',
  trailColor = 'rgba(255, 255, 255, 0.3)',
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1000,
  maxDelay = 5000,
  count = 5
}) => {
  const containerRef = useRef(null);
  const stars = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.width = '2px';
      star.style.height = '2px';
      star.style.borderRadius = '50%';
      star.style.backgroundColor = starColor;
      star.style.boxShadow = `0 0 5px 1px ${starColor}`;
      
      // Create trail
      const trail = document.createElement('div');
      trail.style.position = 'absolute';
      trail.style.width = '100%';
      trail.style.height = '2px';
      trail.style.background = `linear-gradient(90deg, ${trailColor}, transparent)`;
      trail.style.transformOrigin = 'left center';
      
      star.appendChild(trail);
      container.appendChild(star);
      
      return star;
    };

    const animateStar = (star) => {
      const containerRect = container.getBoundingClientRect();
      const startX = Math.random() * containerRect.width;
      const startY = Math.random() * containerRect.height;
      const angle = Math.random() * Math.PI * 2;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const distance = Math.max(containerRect.width, containerRect.height) * 1.5;
      const duration = distance / speed;
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;

      // Set initial position
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      star.style.opacity = '0';
      star.style.transform = `rotate(${angle}rad)`;
      star.style.transition = 'none';
      
      // Reset trail
      const trail = star.firstChild;
      trail.style.width = '0%';
      trail.style.transition = 'none';

      // Animate
      setTimeout(() => {
        star.style.opacity = '1';
        star.style.transition = `opacity 0.3s ease-in, transform ${duration}s linear`;
        star.style.transform = `translateX(${Math.cos(angle) * distance}px) translateY(${Math.sin(angle) * distance}px) rotate(${angle}rad)`;
        
        // Animate trail
        setTimeout(() => {
          trail.style.transition = `width ${duration - 0.1}s linear`;
          trail.style.width = '100%';
        }, 10);
        
        // Reset and restart animation
        setTimeout(() => {
          star.style.opacity = '0';
          star.style.transition = 'opacity 0.3s ease-out';
          
          setTimeout(() => {
            star.style.transition = 'none';
            animateStar(star);
          }, 300);
        }, duration * 1000 - 300);
      }, delay);
    };

    // Create initial stars
    stars.current = Array(count).fill().map(() => createStar());
    stars.current.forEach(star => animateStar(star));

    // Cleanup
    return () => {
      stars.current.forEach(star => {
        if (star.parentNode === container) {
          container.removeChild(star);
        }
      });
      stars.current = [];
    };
  }, [starColor, trailColor, minSpeed, maxSpeed, minDelay, maxDelay, count]);

  return <div ref={containerRef} style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 1
  }} />;
};

export default ShootingStars;
