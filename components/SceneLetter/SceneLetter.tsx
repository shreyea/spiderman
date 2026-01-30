'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './SceneLetter.module.css';

const SceneLetter: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Ambient particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 3,
  }));

  const webStringVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const letterVariants = {
    hidden: { y: -200, opacity: 0, rotate: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        delay: 0.5,
      },
    },
    float: {
      y: [0, -8, 0],
      rotate: [-1, 1, -1],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
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
        delay: 1.5,
      },
    }),
  };

  return (
    <section className={styles.letterSection} ref={ref}>
      {/* Ambient Particles */}
      <div className={styles.particlesContainer}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={styles.particle}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-5, 5, -5],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <div className={styles.grainOverlay} />

      {/* Web Corner Decorations */}
      <div className={`${styles.webCorner} ${styles.webCornerTopLeft}`}>
        <svg className={styles.webCornerSvg} viewBox="0 0 100 100">
          <path d="M 0 0 Q 50 10 100 0" className={styles.webCornerPath} />
          <path d="M 0 0 Q 10 50 0 100" className={styles.webCornerPath} />
          <path d="M 0 0 L 70 70" className={styles.webCornerPath} />
          <path d="M 0 30 Q 30 40 50 30" className={styles.webCornerPath} />
          <path d="M 30 0 Q 40 30 30 50" className={styles.webCornerPath} />
        </svg>
      </div>
      <div className={`${styles.webCorner} ${styles.webCornerBottomRight}`}>
        <svg className={styles.webCornerSvg} viewBox="0 0 100 100">
          <path d="M 0 0 Q 50 10 100 0" className={styles.webCornerPath} />
          <path d="M 0 0 Q 10 50 0 100" className={styles.webCornerPath} />
          <path d="M 0 0 L 70 70" className={styles.webCornerPath} />
          <path d="M 0 30 Q 30 40 50 30" className={styles.webCornerPath} />
          <path d="M 30 0 Q 40 30 30 50" className={styles.webCornerPath} />
        </svg>
      </div>

      {/* Floating Icons */}
      <div className={styles.floatingIcons}>
        <motion.div
          className={styles.floatingIcon}
          style={{ top: '20%', left: '15%', color: 'var(--color-pink)' }}
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={28} />
        </motion.div>
        <motion.div
          className={styles.floatingIcon}
          style={{ top: '30%', right: '18%', color: 'var(--color-gold)' }}
          animate={{ y: [8, -12, 8], rotate: [3, -3, 3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Sparkles size={24} />
        </motion.div>
        <motion.div
          className={styles.floatingIcon}
          style={{ bottom: '25%', left: '20%', color: 'var(--color-gold-soft)' }}
          animate={{ y: [-8, 12, -8], rotate: [-3, 3, -3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Star size={22} />
        </motion.div>
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          A Letter For You
        </motion.h2>

        {/* Letter with Web String */}
        <div className={styles.letterContainer}>
          {/* Web String */}
          <motion.div
            className={styles.webString}
            variants={webStringVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          />

          {/* Letter Frame */}
          <motion.div
            className={styles.letterFrame}
            variants={letterVariants}
            initial="hidden"
            animate={inView ? ['visible', 'float'] : 'hidden'}
          >
            {/* Paper Lines */}
            <div className={styles.paperLines} />

            {/* Corner Decorations */}
            <div className={`${styles.cornerDecoration} ${styles.cornerTopLeft}`} />
            <div className={`${styles.cornerDecoration} ${styles.cornerTopRight}`} />
            <div className={`${styles.cornerDecoration} ${styles.cornerBottomLeft}`} />
            <div className={`${styles.cornerDecoration} ${styles.cornerBottomRight}`} />

            {/* Wax Seal */}
            <motion.div
              className={styles.waxSeal}
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: 'spring', delay: 1.2 }}
            >
              <Heart size={24} fill="currentColor" />
            </motion.div>

            {/* Letter Content */}
            <div className={styles.letterContent}>
              <p className={styles.letterDate}>January 30, 2026</p>
              
              <p className={styles.letterGreeting}>My Dearest,</p>
              
              <div className={styles.letterBody}>
                <p>
                  From the moment our paths crossed, my world changed in ways I never 
                  thought possible. You brought color to my days and warmth to my heart 
                  that I never knew I was missing.
                </p>
                <p>
                  Every moment with you feels like a scene from our own love story - 
                  one that I never want to end. You are my partner, my confidant, my 
                  best friend, and the love of my life.
                </p>
                <p>
                  Thank you for being you. Thank you for choosing me. Thank you for 
                  making every ordinary day feel extraordinary.
                </p>
              </div>
              
              <p className={styles.letterClosing}>Forever and always yours,</p>
              <p className={styles.signature}>With All My Love</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stickers */}
      <motion.div
        className={`${styles.sticker} ${styles.stickerLetter}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={10}
      >
        LETTER
      </motion.div>
      <motion.div
        className={`${styles.sticker} ${styles.stickerXoxo}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={-8}
      >
        XOXO
      </motion.div>
    </section>
  );
};

export default SceneLetter;
