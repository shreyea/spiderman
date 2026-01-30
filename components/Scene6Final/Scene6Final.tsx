'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene6Final.module.css';

const Scene6Final: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [displayedText, setDisplayedText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const fullText = 'You are my greatest adventure.';

  // Generate stars
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
  }));

  // Typewriter effect
  useEffect(() => {
    if (!inView) return;
    
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowButtons(true), 500);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [inView]);

  // Generate celebration elements
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#e63946', '#ffd700', '#ff8fab', '#4a6fa5', '#7c6c9f'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
  }));

  const celebrationHearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 16 + Math.random() * 24,
    delay: Math.random() * 0.8,
  }));

  const celebrationStars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 14 + Math.random() * 20,
    delay: Math.random() * 0.6,
  }));

  // Sparkles around heart
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * 360,
    distance: 120 + Math.random() * 30,
    delay: i * 0.2,
  }));

  const handleButtonClick = () => {
    setCelebrating(true);
  };

  const heartPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: 'easeInOut' },
        opacity: { duration: 0.5 },
      },
    },
  };

  const stickerVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: (rotation: number) => ({
      scale: 1,
      rotate: rotation,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 1,
      },
    }),
  };

  return (
    <section className={styles.finalSection} ref={ref}>
      {/* Stars Background */}
      <div className={styles.starsContainer}>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className={styles.star}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <div className={styles.grainOverlay} />

      {/* Content */}
      <div className={styles.contentContainer}>
        {/* Web Heart */}
        <motion.div
          className={styles.webHeartContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.webHeartGlow} />
          <svg className={styles.webHeartSvg} viewBox="0 0 300 280">
            <motion.path
              className={styles.webHeartPath}
              d="M150 250 
                 C80 200 20 150 20 90 
                 C20 40 60 10 100 10 
                 C130 10 150 30 150 50 
                 C150 30 170 10 200 10 
                 C240 10 280 40 280 90 
                 C280 150 220 200 150 250Z"
              variants={heartPathVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            />
            {/* Inner web details */}
            <motion.path
              className={styles.webHeartPath}
              d="M150 200 L150 50 M100 120 L200 120 M80 80 L220 160 M220 80 L80 160"
              style={{ strokeWidth: 2, opacity: 0.5 }}
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 2 }}
            />
          </svg>

          {/* Sparkles around heart */}
          <div className={styles.sparklesContainer}>
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className={styles.sparkle}
                style={{
                  left: `calc(50% + ${Math.cos(sparkle.angle * Math.PI / 180) * sparkle.distance}px)`,
                  top: `calc(50% + ${Math.sin(sparkle.angle * Math.PI / 180) * sparkle.distance}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.3, 0.8],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: sparkle.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles size={16} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Typewriter Text */}
        <div className={styles.typewriterContainer}>
          <p className={styles.typewriterText}>
            {displayedText}
            <span className={styles.cursor} />
          </p>
        </div>

        {/* Buttons */}
        <AnimatePresence>
          {showButtons && !celebrating && (
            <motion.div
              className={styles.buttonsContainer}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <motion.button
                className={`${styles.speechButton} ${styles.yesButton}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
              >
                YES
              </motion.button>
              <motion.button
                className={`${styles.speechButton} ${styles.alwaysButton}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
              >
                ALWAYS
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stickers */}
      <motion.div
        className={`${styles.sticker} ${styles.stickerLove}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={-10}
      >
        LOVE
      </motion.div>
      <motion.div
        className={`${styles.sticker} ${styles.stickerForever}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={8}
      >
        FOREVER
      </motion.div>

      {/* Celebration */}
      <AnimatePresence>
        {celebrating && (
          <>
            {/* Screen Glow */}
            <motion.div
              className={styles.screenGlow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Celebration Overlay */}
            <div className={styles.celebrationOverlay}>
              {/* Confetti */}
              {confetti.map((c) => (
                <motion.div
                  key={c.id}
                  className={styles.confetti}
                  style={{
                    left: `${c.left}%`,
                    background: c.color,
                    rotate: c.rotation,
                  }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{
                    y: ['0vh', '100vh'],
                    opacity: [1, 1, 0],
                    rotate: [c.rotation, c.rotation + 720],
                  }}
                  transition={{
                    duration: 3,
                    delay: c.delay,
                    ease: 'easeIn',
                  }}
                />
              ))}

              {/* Hearts */}
              {celebrationHearts.map((h) => (
                <motion.div
                  key={h.id}
                  className={styles.celebrationHeart}
                  style={{ left: `${h.left}%` }}
                  initial={{ y: '100vh', opacity: 0 }}
                  animate={{
                    y: ['-100vh'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    delay: h.delay,
                    ease: 'easeOut',
                  }}
                >
                  <Heart size={h.size} fill="currentColor" />
                </motion.div>
              ))}

              {/* Stars */}
              {celebrationStars.map((s) => (
                <motion.div
                  key={s.id}
                  className={styles.celebrationStar}
                  style={{ left: `${s.left}%` }}
                  initial={{ y: '100vh', opacity: 0, rotate: 0 }}
                  animate={{
                    y: ['-100vh'],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: s.delay + 0.3,
                    ease: 'easeOut',
                  }}
                >
                  <Star size={s.size} fill="currentColor" />
                </motion.div>
              ))}

              {/* Web Burst */}
              <motion.svg
                className={styles.webBurst}
                viewBox="0 0 400 400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i / 12) * 360;
                  const x2 = 200 + Math.cos(angle * Math.PI / 180) * 180;
                  const y2 = 200 + Math.sin(angle * Math.PI / 180) * 180;
                  return (
                    <line
                      key={i}
                      x1="200"
                      y1="200"
                      x2={x2}
                      y2={y2}
                      className={styles.webBurstLine}
                    />
                  );
                })}
              </motion.svg>

              {/* Forever Message */}
              <motion.div
                className={styles.foreverMessage}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
              >
                FOREVER!
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Comic Stickers */}
      <motion.div
        className={styles.comicSticker}
        style={{
          top: '10%',
          left: '5%',
          backgroundColor: '#e63946',
          transform: 'rotate(-12deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '-17deg' }}
      >
        <span>FOREVER</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          top: '18%',
          right: '8%',
          backgroundColor: '#ffd700',
          transform: 'rotate(10deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2.3, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '15deg' }}
      >
        <span>LOVE</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '25%',
          left: '8%',
          backgroundColor: '#457b9d',
          transform: 'rotate(-8deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2.6, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '-13deg' }}
      >
        <span>HERO</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '15%',
          right: '5%',
          backgroundColor: '#e63946',
          transform: 'rotate(14deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2.9, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '19deg' }}
      >
        <span>ADVENTURE</span>
      </motion.div>
    </section>
  );
};

export default Scene6Final;
