'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene5LoveMeter.module.css';

const Scene5LoveMeter: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const containerRef = useRef<HTMLElement | null>(null);
  const [clickBonus, setClickBonus] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [clickBursts, setClickBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Scroll fills 70% of the meter
  const scrollFill = useTransform(scrollYProgress, [0.2, 0.8], [0, 70]);

  // Total fill = scroll + click bonus (max 100)
  const [displayedFill, setDisplayedFill] = useState(0);

  // Update displayed fill based on scroll
  React.useEffect(() => {
    const unsubscribe = scrollFill.on('change', (value) => {
      setDisplayedFill(Math.min(100, value + clickBonus));
    });
    return () => unsubscribe();
  }, [scrollFill, clickBonus]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (displayedFill >= 100) {
      // Trigger shake when already full
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }

    // Add click bonus (each click adds 5%, up to 30% total)
    setClickBonus((prev) => Math.min(30, prev + 5));

    // Add burst effect
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setClickBursts((prev) => [...prev, { id, x, y }]);

    // Remove burst after animation
    setTimeout(() => {
      setClickBursts((prev) => prev.filter((b) => b.id !== id));
    }, 500);
  }, [displayedFill]);

  const filledSegments = Math.floor(displayedFill / 10);
  const isFull = displayedFill >= 100;

  const stickerVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: (rotation: number) => ({
      scale: 1,
      rotate: rotation,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.8,
      },
    }),
  };

  return (
    <section
      className={styles.meterSection}
      ref={(node) => {
        containerRef.current = node;
        ref(node);
      }}
    >
      {/* Web Pattern Background */}
      <div className={styles.webPattern}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="45" className={styles.webPatternLine} />
          <circle cx="50" cy="50" r="35" className={styles.webPatternLine} />
          <circle cx="50" cy="50" r="25" className={styles.webPatternLine} />
          <circle cx="50" cy="50" r="15" className={styles.webPatternLine} />
          <line x1="50" y1="5" x2="50" y2="95" className={styles.webPatternLine} />
          <line x1="5" y1="50" x2="95" y2="50" className={styles.webPatternLine} />
          <line x1="15" y1="15" x2="85" y2="85" className={styles.webPatternLine} />
          <line x1="85" y1="15" x2="15" y2="85" className={styles.webPatternLine} />
        </svg>
      </div>
      <div className={styles.grainOverlay} />

      {/* Web Decoration Lines */}
      <div className={styles.webDecorations}>
        <motion.div
          className={`${styles.webLine} ${styles.webLine1}`}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.div
          className={`${styles.webLine} ${styles.webLine2}`}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        <motion.div
          className={`${styles.webLine} ${styles.webLine3}`}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        />
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Love Power Meter
        </motion.h2>

        {/* Meter Container */}
        <motion.div
          className={`${styles.meterContainer} ${isShaking ? styles.shake : ''} ${isFull ? styles.fullGlow : ''}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={handleClick}
        >
          {/* Heart Icon */}
          <div className={styles.heartIcon}>
            <motion.div
              animate={isFull ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }}
              transition={{ duration: isFull ? 0.5 : 1.5, repeat: Infinity }}
            >
              <Heart
                className={styles.heartIconInner}
                size={64}
                fill="currentColor"
              />
            </motion.div>
            {isFull && (
              <motion.div
                className={styles.sparkleRing}
                animate={{ opacity: [0, 1, 0], rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>

          {/* Meter Track */}
          <div className={styles.meterTrack}>
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div
                key={i}
                className={styles.meterSegment}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div
                  className={`${styles.segmentFill} ${i < filledSegments ? styles.filled : ''}`}
                />
              </motion.div>
            ))}
          </div>

          {/* Percentage */}
          <motion.div
            className={styles.percentage}
            key={Math.floor(displayedFill)}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {Math.floor(displayedFill)}%
          </motion.div>

          {/* Power Level Text */}
          <div className={styles.powerLevel}>
            {isFull ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                UNSTOPPABLE
              </motion.span>
            ) : (
              'Power Level'
            )}
          </div>

          {/* Click Instruction */}
          <div className={styles.clickInstruction}>
            {isFull ? 'Maximum Power Achieved!' : 'Scroll & Click to Power Up'}
          </div>

          {/* Click Burst Effects */}
          <AnimatePresence>
            {clickBursts.map((burst) => (
              <motion.div
                key={burst.id}
                className={styles.clickBurst}
                style={{ left: burst.x, top: burst.y }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stickers */}
      <motion.div
        className={styles.comicSticker}
        style={{
          top: '8%',
          left: '5%',
          backgroundColor: '#e63946',
          transform: 'rotate(-10deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '-15deg' }}
      >
        <span>POWER</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          top: '15%',
          right: '8%',
          backgroundColor: '#ffd700',
          transform: 'rotate(12deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2.3, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '17deg' }}
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
        <span>ENERGY</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '18%',
          right: '5%',
          backgroundColor: '#e63946',
          transform: 'rotate(10deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2.9, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '15deg' }}
      >
        <span>MAXIMUM</span>
      </motion.div>

      <motion.div
        className={`${styles.sticker} ${styles.stickerPower}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={10}
      >
        POWER
      </motion.div>
      <motion.div
        className={`${styles.sticker} ${styles.stickerMax}`}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={-8}
      >
        MAX
      </motion.div>
    </section>
  );
};

export default Scene5LoveMeter;
