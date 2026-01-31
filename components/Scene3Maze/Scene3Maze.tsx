'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene3Maze.module.css';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  caught: boolean;
}

const Scene3Maze: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const gameRef = useRef<HTMLDivElement>(null);

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const [showMessage, setShowMessage] = useState('');
  const [hasWon, setHasWon] = useState(false);
  const [stickerBurst, setStickerBurst] = useState<{ x: number; y: number } | null>(null);

  // Generate hearts
  const generateHearts = useCallback(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      size: 28 + Math.random() * 18,
      caught: false,
    }));
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setHasWon(false);
    setCaughtCount(0);
    setShowMessage('');
    setHearts(generateHearts());
  }, [generateHearts]);

  // Reset game
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setHasWon(false);
    setCaughtCount(0);
    setShowMessage('');
    setHearts([]);
  }, []);

  // Handle cursor movement
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!gameRef.current || !isPlaying || hasWon) return;

    const rect = gameRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setCursorPosition({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    });
  }, [isPlaying, hasWon]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [handleMove]);

  // Check for heart catches
  useEffect(() => {
    if (!isPlaying || hasWon) return;

    const catchRadius = 8;
    let newCaughtCount = 0;
    let justCaught = false;
    let caughtPosition = { x: 0, y: 0 };

    const updatedHearts = hearts.map(heart => {
      if (heart.caught) {
        newCaughtCount++;
        return heart;
      }

      const distance = Math.sqrt(
        Math.pow(heart.x - cursorPosition.x, 2) +
        Math.pow(heart.y - cursorPosition.y, 2)
      );

      if (distance < catchRadius) {
        newCaughtCount++;
        justCaught = true;
        caughtPosition = { x: heart.x, y: heart.y };
        return { ...heart, caught: true };
      }

      return heart;
    });

    if (justCaught) {
      setHearts(updatedHearts);
      setCaughtCount(newCaughtCount);
      setStickerBurst(caughtPosition);
      setShowMessage('You caught my heart! 💕');

      setTimeout(() => {
        setShowMessage('');
        setStickerBurst(null);
      }, 1200);

      // Check for win
      if (newCaughtCount >= 3) {
        setTimeout(() => {
          setHasWon(true);
        }, 1000);
      }
    }
  }, [cursorPosition, hearts, isPlaying, hasWon]);

  // Floating stickers for win
  const winStickers = [
    { src: '/stickers/web2.png', angle: 45, delay: 0.1 },
    { src: '/stickers/web1.png', angle: 135, delay: 0.2 },
    { src: '/stickers/spi2.png', angle: 225, delay: 0.3 },
    { src: '/stickers/aesthetic_heart_sticker___Pink_Web_Heart_Sticker-removebg-preview.png', angle: 315, delay: 0.4 },
  ];

  // Confetti hearts
  const confettiHearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 0.5,
    size: 14 + Math.random() * 14,
  }));

  return (
    <section className={styles.mazeSection} ref={ref}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <img src="/images/back3.png" alt="Hearts Background" />
      </div>

      {/* Overlays */}
      <div className={styles.darkOverlay} />
      <div className={styles.comicHalftone} />
      <div className={styles.grainOverlay} />

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Catch My Heart
        </motion.h2>

        {/* Caught Counter */}
        {isPlaying && !hasWon && (
          <motion.div
            className={styles.caughtCounter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Heart size={22} fill="var(--color-primary)" />
            <span>{caughtCount} / 3 Hearts</span>
          </motion.div>
        )}

        {/* Message Bubble */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              className={styles.messageBubble}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {showMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Container */}
        <motion.div
          ref={gameRef}
          className={styles.gameContainer}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Floating Hearts */}
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              className={`${styles.floatingHeart} ${heart.caught ? styles.caught : ''}`}
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
              }}
              animate={!heart.caught ? {
                y: [0, -15, 0],
                x: [0, 8, 0, -8, 0],
                rotate: [-5, 5, -5],
              } : {
                scale: 0,
                opacity: 0,
              }}
              transition={!heart.caught ? {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              } : {
                duration: 0.3,
              }}
            >
              <Heart size={heart.size} fill="var(--color-primary)" color="var(--color-primary)" />
            </motion.div>
          ))}

          {/* Web Cursor */}
          {isPlaying && !hasWon && (
            <motion.div
              className={styles.webCursor}
              style={{
                left: `${cursorPosition.x}%`,
                top: `${cursorPosition.y}%`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className={styles.webCursorInner}>
                <Sparkles size={18} />
              </div>
            </motion.div>
          )}

          {/* Sticker Burst Effect */}
          <AnimatePresence>
            {stickerBurst && (
              <motion.div
                className={styles.stickerBurst}
                style={{
                  left: `${stickerBurst.x}%`,
                  top: `${stickerBurst.y}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>

          {/* Start Overlay */}
          {!isPlaying && !hasWon && (
            <motion.div className={styles.startOverlay}>
              <button className={styles.startButton} onClick={startGame}>
                <Heart size={22} fill="white" />
                Start Catching
              </button>
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
                {/* Confetti Hearts */}
                {confettiHearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    className={styles.confettiHeart}
                    style={{ left: `${heart.left}%` }}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '-100%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.5, delay: heart.delay }}
                  >
                    <Heart size={heart.size} fill="var(--color-primary)" />
                  </motion.div>
                ))}

                {/* Flying Stickers */}
                {winStickers.map((sticker, i) => (
                  <motion.img
                    key={i}
                    src={sticker.src}
                    alt="Sticker"
                    className={styles.flyingSticker}
                    initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                    animate={{
                      scale: 1,
                      x: Math.cos(sticker.angle * Math.PI / 180) * 120,
                      y: Math.sin(sticker.angle * Math.PI / 180) * 120,
                      rotate: 360,
                    }}
                    transition={{ delay: sticker.delay, duration: 0.8, type: 'spring' }}
                  />
                ))}

                {/* Victory Content */}
                <motion.div
                  className={styles.victoryContent}
                  initial={{ scale: 0, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  <div className={styles.victoryMessage}>
                    No matter what, my heart chooses you 💕
                  </div>
                  <motion.button
                    className={styles.playAgainButton}
                    onClick={resetGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={18} />
                    Play Again
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Control Hint */}
        {isPlaying && !hasWon && (
          <motion.div
            className={styles.controlHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Move your cursor or finger to catch hearts
          </motion.div>
        )}
      </div>

      {/* Corner Stickers with bouncy/windy animations */}
      <motion.img
        src="/stickers/wh2.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '12%', left: '15%' }}
        initial={{ scale: 0, rotate: -15 }}
        animate={inView ? {
          scale: 1,
          rotate: [-8, -3, -8],
          y: [0, -8, 0],
        } : {}}
        transition={{
          delay: 0.8,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/wh.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '28%', right: '15%' }}
        initial={{ scale: 0, rotate: 15 }}
        animate={inView ? {
          scale: 1,
          rotate: [8, 12, 8],
          y: [0, 6, 0],
        } : {}}
        transition={{
          delay: 1,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/wh3.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ bottom: '15%', right: '5%' }}
        initial={{ scale: 0, rotate: -10 }}
        animate={inView ? {
          scale: [1, 1.08, 1],
          rotate: [5, 10, 5],
        } : {}}
        transition={{
          delay: 1.2,
          type: 'spring',
          stiffness: 150,
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/wh4.png"
        alt="Heart Sticker"
        className={styles.stickerImage}
        style={{ bottom: '18%', left: '14%', width: '75px' }}
        initial={{ scale: 0, rotate: 10 }}
        animate={inView ? {
          scale: [1, 1.12, 1],
          rotate: [-5, 0, -5],
          y: [0, -10, 0],
        } : {}}
        transition={{
          delay: 1.4,
          type: 'spring',
          stiffness: 130,
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Corner Text Stickers */}
      <motion.div
        className={`${styles.textSticker} ${styles.stickerLove}`}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.6, type: 'spring' }}
      >
        LOVE
      </motion.div>
      <motion.div
        className={`${styles.textSticker} ${styles.stickerForever}`}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.8, type: 'spring' }}
      >
        FOREVER
      </motion.div>
    </section>
  );
};

export default Scene3Maze;
