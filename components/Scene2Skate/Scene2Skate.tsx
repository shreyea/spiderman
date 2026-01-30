'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Heart, Sparkles, Zap, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene2Skate.module.css';

const Scene2Skate: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [started, setStarted] = useState(false);

  const handleStart = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setStarted(true);
  };

  // Skate animation
  const skateVariants = {
    animate: {
      x: ['-10vw', '110vw'],
      transition: {
        duration: 8,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 2,
      }
    }
  };

  // Tilt animation synchronized with the movement
  const tiltVariants = {
    animate: {
      rotate: [5, -3, 2, -1, 0, 5],
      transition: {
        duration: 8,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 2,
      }
    }
  };

  // Speed lines
  const speedLines = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: 15 + Math.random() * 70,
    width: 60 + Math.random() * 120,
    delay: i * 0.08,
    left: Math.random() * 60,
  }));

  // Web nodes for decoration
  const webNodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: 10 + Math.random() * 80,
    left: 10 + Math.random() * 80,
  }));

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  const stickerVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: (delay: number) => ({
      scale: 1,
      rotate: delay === 0 ? 12 : -8,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.5 + delay * 0.2,
      },
    }),
  };

  return (
    <section 
      className={styles.skateSection}
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        inViewRef(node);
      }}
    >
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <img src="/images/back.jpg" alt="Background" />
      </div>

      {/* Overlays */}
      <div className={styles.vignetteOverlay} />
      <div className={styles.grainOverlay} />

      {/* Speed Lines */}
      <div className={styles.speedLinesContainer}>
        {speedLines.map((line) => (
          <motion.div
            key={line.id}
            className={styles.speedLine}
            style={{
              top: `${line.top}%`,
              left: `${line.left}%`,
              width: line.width,
            }}
            animate={inView ? {
              opacity: [0, 0.6, 0],
              x: [0, 200, 400],
            } : {}}
            transition={{
              duration: 1.5,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Web Nodes */}
      <div className={styles.webNodes}>
        {webNodes.map((node) => (
          <motion.div
            key={node.id}
            className={styles.webNode}
            style={{ top: `${node.top}%`, left: `${node.left}%` }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              delay: node.id * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className={styles.floatingIcons}>
        <motion.div
          className={styles.floatingIcon}
          style={{ top: '20%', left: '15%', color: 'var(--color-pink)' }}
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={28} />
        </motion.div>
        <motion.div
          className={styles.floatingIcon}
          style={{ top: '30%', right: '20%', color: 'var(--color-gold)' }}
          animate={{ y: [10, -15, 10], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Sparkles size={24} />
        </motion.div>
        <motion.div
          className={styles.floatingIcon}
          style={{ bottom: '35%', left: '25%', color: 'var(--color-primary-light)' }}
          animate={{ y: [-8, 12, -8], rotate: [-3, 3, -3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Star size={26} />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Headline */}
        <motion.div
          className={styles.textContent}
          variants={textVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles.headline}>
            Every journey feels lighter with you
          </h2>
        </motion.div>

        {/* Skate Track */}
        <div className={styles.skateTrack} onClick={handleStart}>
          {/* Skate */}
          <motion.div
            className={styles.skateContainer}
            variants={skateVariants}
            initial={{ x: '-10vw' }}
            animate={started ? 'animate' : undefined}
          >
            <motion.img 
              src="/images/skate.png" 
              alt="Skateboard" 
              className={styles.skateImage}
              variants={tiltVariants}
              animate={started ? 'animate' : undefined}
            />
            <div className={styles.skateShadow} />
          </motion.div>

          {!started && (
            <div className={styles.startOverlay} onClick={handleStart}>
              <button className={styles.startButton} onClick={handleStart}>Click to Start</button>
            </div>
          )}
        </div>
      </div>

      {/* Stickers */}
      <motion.div
        className={`${styles.sticker} ${styles.stickerZoom}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={0}
      >
        ZOOM
      </motion.div>
      <motion.div
        className={`${styles.sticker} ${styles.stickerGo}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={1}
      >
        GO
      </motion.div>
    </section>
  );
};

export default Scene2Skate;
