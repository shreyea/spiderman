'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './Scene5LoveMeter.module.css';

const Scene5LoveMeter: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const [fillLevel, setFillLevel] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setFillLevel(100);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFillLevel(0);
    }
  }, [inView]);

  return (
    <section className={styles.scene} ref={ref}>
      {/* Background */}
      <div className={styles.background}></div>
      <div className={styles.particleOverlay}></div>

      {/* Decorative elements */}
      <div className={styles.webCorner1}>
        <svg viewBox="0 0 100 100">
          <path d="M0 0 Q50 50 0 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
          <path d="M0 0 Q30 50 0 100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
          <path d="M0 0 Q70 50 0 100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className={styles.webCorner2}>
        <svg viewBox="0 0 100 100">
          <path d="M100 0 Q50 50 100 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
          <path d="M100 0 Q70 50 100 100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
          <path d="M100 0 Q30 50 100 100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Title */}
      <motion.h2 
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        Love Power Level
      </motion.h2>

      {/* Main Heart Container */}
      <motion.div 
        className={styles.heartContainer}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Glowing backdrop */}
        <motion.div 
          className={styles.heartGlow}
          animate={inView ? {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Heart SVG */}
        <div className={styles.heartWrapper}>
          <svg viewBox="0 0 200 180" className={styles.heartSvg}>
            {/* Heart outline */}
            <defs>
              <clipPath id="heartClip">
                <path d="M100 170 C40 120 0 80 0 50 C0 20 25 0 55 0 C75 0 90 15 100 30 C110 15 125 0 145 0 C175 0 200 20 200 50 C200 80 160 120 100 170 Z" />
              </clipPath>
              <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#e63946" />
                <stop offset="50%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#ff8e8e" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background heart */}
            <path 
              d="M100 170 C40 120 0 80 0 50 C0 20 25 0 55 0 C75 0 90 15 100 30 C110 15 125 0 145 0 C175 0 200 20 200 50 C200 80 160 120 100 170 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />

            {/* Fill animation */}
            <g clipPath="url(#heartClip)">
              <motion.rect
                x="0"
                y="180"
                width="200"
                height="180"
                fill="url(#fillGradient)"
                filter="url(#glow)"
                initial={{ y: 180 }}
                animate={{ y: 180 - (fillLevel * 1.8) }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
              />
              
              {/* Wave effect */}
              <motion.path
                d="M-20 0 Q30 -10 80 0 T180 0 T280 0 V200 H-20 Z"
                fill="rgba(255,255,255,0.2)"
                initial={{ x: -100, y: 180 }}
                animate={{ 
                  x: [-100, 0, -100],
                  y: 180 - (fillLevel * 1.8) - 5 
                }}
                transition={{ 
                  x: { duration: 3, repeat: Infinity, ease: 'linear' },
                  y: { duration: 2.5, ease: 'easeOut' }
                }}
              />
            </g>

            {/* Heart outline stroke */}
            <path 
              d="M100 170 C40 120 0 80 0 50 C0 20 25 0 55 0 C75 0 90 15 100 30 C110 15 125 0 145 0 C175 0 200 20 200 50 C200 80 160 120 100 170 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              filter="url(#glow)"
            />
          </svg>

          {/* Percentage text */}
          <motion.div 
            className={styles.percentageText}
            animate={inView ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.span 
              className={styles.percentNumber}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {fillLevel}%
            </motion.span>
          </motion.div>
        </div>

        {/* Pulsing rings */}
        {inView && [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={styles.pulseRing}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>

      {/* Message */}
      <motion.p 
        className={styles.message}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        My love for you is <span className={styles.highlight}>infinite</span> ❤️
      </motion.p>

      {/* Floating Hearts */}
      {inView && [...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.floatingHeart}
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: '10%',
          }}
          animate={{
            y: [0, -400],
            x: [0, Math.sin(i) * 40],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeOut',
          }}
        >
          {['❤️', '💕', '💖', '💗', '💓'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      {/* Sparkles */}
      {inView && [...Array(15)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className={styles.sparkle}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ✨
        </motion.div>
      ))}
    </section>
  );
};

export default Scene5LoveMeter;
