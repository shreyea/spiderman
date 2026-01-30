'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene3Maze.module.css';

const Scene3Maze: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const mazeRef = useRef<HTMLDivElement>(null);
  const [heartPosition, setHeartPosition] = useState({ x: 50, y: 50 });
  const [hasWon, setHasWon] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Center position (goal)
  const centerX = 250;
  const centerY = 250;
  const winRadius = 40;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mazeRef.current || hasWon) return;
    
    const rect = mazeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    
    setHeartPosition({ x, y });

    // Check if reached center
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    if (distance < winRadius) {
      setHasWon(true);
    }
  }, [hasWon]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!mazeRef.current || hasWon) return;
    
    const touch = e.touches[0];
    const rect = mazeRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 500;
    const y = ((touch.clientY - rect.top) / rect.height) * 500;
    
    setHeartPosition({ x, y });

    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    if (distance < winRadius) {
      setHasWon(true);
    }
  }, [hasWon]);

  // Floating hearts decoration
  const floatingHearts = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 16 + Math.random() * 12,
    left: 5 + Math.random() * 90,
    top: 5 + Math.random() * 90,
    delay: i * 0.5,
  }));

  const stickerVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: (delay: number) => ({
      scale: 1,
      rotate: delay === 0 ? 10 : -8,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.5 + delay * 0.2,
      },
    }),
  };

  return (
    <section className={styles.mazeSection} ref={ref}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <img src="/images/hearts.png" alt="Hearts Background" />
      </div>

      {/* Overlays */}
      <div className={styles.darkOverlay} />
      <div className={styles.grainOverlay} />

      {/* Floating Decorations */}
      <div className={styles.floatingDecorations}>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className={styles.floatingHeart}
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + heart.id * 0.5,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Heart size={heart.size} />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Find Your Way
        </motion.h2>

        {/* Maze */}
        <motion.div
          ref={mazeRef}
          className={styles.mazeContainer}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Maze Web Lines SVG */}
          <svg className={styles.mazeSvg} viewBox="0 0 500 500">
            <defs>
              <radialGradient id="mazeGrad" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#ffd700" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#e63946" stopOpacity="0.05" />
              </radialGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Layered circular rings with gaps using dasharray for puzzle-like paths */}
            <circle cx="250" cy="250" r="210" className={`${styles.mazePath} ${styles.mazePrimary}`} stroke="url(#mazeGrad)" filter="url(#glow)" strokeDasharray="1100 220" />
            <circle cx="250" cy="250" r="170" className={`${styles.mazePath} ${styles.mazeDetail}`} stroke="url(#mazeGrad)" strokeDasharray="700 300" />
            <circle cx="250" cy="250" r="125" className={`${styles.mazePath} ${styles.mazePrimary}`} stroke="url(#mazeGrad)" filter="url(#glow)" strokeDasharray="480 180" />
            <circle cx="250" cy="250" r="80" className={`${styles.mazePath} ${styles.mazeDetail}`} stroke="url(#mazeGrad)" strokeDasharray="260 120" />

            {/* Radial connectors with subtle gaps to create choice points */}
            <line x1="250" y1="40" x2="250" y2="140" className={`${styles.mazePath} ${styles.mazeDetail}` } />
            <line x1="250" y1="360" x2="250" y2="460" className={`${styles.mazePath} ${styles.mazeDetail}` } />
            <line x1="40" y1="250" x2="140" y2="250" className={`${styles.mazePath} ${styles.mazeDetail}` } />
            <line x1="360" y1="250" x2="460" y2="250" className={`${styles.mazePath} ${styles.mazeDetail}` } />

            {/* Curved strands to add character and alternate routes */}
            <path d="M 110 150 Q 190 210 190 250" className={`${styles.mazePath} ${styles.mazeDetail}`} />
            <path d="M 390 150 Q 310 210 310 250" className={`${styles.mazePath} ${styles.mazeDetail}`} />
            <path d="M 110 350 Q 190 290 190 250" className={`${styles.mazePath} ${styles.mazeDetail}`} />
            <path d="M 390 350 Q 310 290 310 250" className={`${styles.mazePath} ${styles.mazeDetail}`} />

            {/* Decorative arcs to increase intricacy */}
            <path d="M 160 90 Q 220 150 250 135" className={`${styles.mazePath} ${styles.mazeAccent}`} />
            <path d="M 340 90 Q 280 150 250 135" className={`${styles.mazePath} ${styles.mazeAccent}`} />
            <path d="M 160 410 Q 220 350 250 365" className={`${styles.mazePath} ${styles.mazeAccent}`} />
            <path d="M 340 410 Q 280 350 250 365" className={`${styles.mazePath} ${styles.mazeAccent}`} />
          </svg>

          {/* Web Glow Effect */}
          <motion.div
            className={styles.webGlow}
            animate={{
              boxShadow: [
                'inset 0 0 30px rgba(255, 255, 255, 0.05)',
                'inset 0 0 50px rgba(255, 255, 255, 0.1)',
                'inset 0 0 30px rgba(255, 255, 255, 0.05)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Center Goal */}
          <div className={styles.centerGoal}>
            <Star className={styles.goalIcon} size={32} />
          </div>

          {/* Heart Player */}
          {isHovering && !hasWon && (
            <motion.div
              className={styles.heartPlayer}
              style={{
                left: (heartPosition.x / 500) * 100 + '%',
                top: (heartPosition.y / 500) * 100 + '%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Heart size={28} fill="var(--color-primary)" color="var(--color-primary)" />
            </motion.div>
          )}

          {/* Victory Overlay */}
          <AnimatePresence>
            {hasWon && (
              <motion.div
                className={styles.victoryOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={styles.victoryBurst}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
                <motion.div
                  className={styles.victoryText}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                >
                  No matter the path, I always reach you
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className={styles.instructions}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          {hasWon ? 'You found me!' : 'Move your cursor to guide the heart to the center'}
        </motion.div>
      </div>

      {/* Stickers */}
      <motion.div
        className={`${styles.sticker} ${styles.stickerFind}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={0}
      >
        FIND
      </motion.div>
      <motion.div
        className={`${styles.sticker} ${styles.stickerLove}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={1}
      >
        LOVE
      </motion.div>
    </section>
  );
};

export default Scene3Maze;
