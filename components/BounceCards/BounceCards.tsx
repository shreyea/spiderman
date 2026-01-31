'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './BounceCards.module.css';

interface BounceCardsProps {
  className?: string;
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

const BounceCards: React.FC<BounceCardsProps> = ({
  className = '',
  images,
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.08,
  easeType = 'elastic.out(1, 0.5)',
  transformStyles = [],
  enableHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    
    // Initial state - hidden
    gsap.set(cards, {
      y: 100,
      opacity: 0,
      scale: 0.8,
    });

    // Animate in
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: animationStagger,
      delay: animationDelay,
      ease: easeType,
    });

    // Apply transform styles after animation
    cards.forEach((card, index) => {
      if (transformStyles[index]) {
        gsap.to(card, {
          delay: animationDelay + (index * animationStagger) + 0.3,
          duration: 0.5,
          ease: easeType,
          attr: { style: `transform: ${transformStyles[index]}` },
        });
        // Directly set transform after a delay
        setTimeout(() => {
          if (card) {
            card.style.transform = transformStyles[index];
          }
        }, (animationDelay + (index * animationStagger) + 0.5) * 1000);
      }
    });
  }, [animationDelay, animationStagger, easeType, transformStyles]);

  const handleMouseEnter = (index: number) => {
    if (!enableHover) return;
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1.1,
        zIndex: 10,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    if (!enableHover) return;
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1,
        zIndex: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.bounceCardsContainer} ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => { cardsRef.current[index] = el; }}
          className={styles.card}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <img src={src} alt={`Card ${index + 1}`} className={styles.image} />
        </div>
      ))}
    </div>
  );
};

export default BounceCards;
