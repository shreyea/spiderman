'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Scene1Arrival.module.css';

const Scene1Arrival: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const skyY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const buildingsY = useTransform(scrollYProgress, [0, 0.2], [0, -20]);
  const heroX = useTransform(scrollYProgress, [0, 0.15], [0, 200]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.section 
      className={styles.scene}
      style={{ opacity: sceneOpacity }}
    >
      {/* Grain Overlay */}
      <div className={styles.grainOverlay}></div>
      
      {/* Sky Layer */}
      <motion.div className={styles.skyLayer} style={{ y: skyY }}>
        {/* Moon */}
        <div className={styles.moon}>
          <div className={styles.moonGlow}></div>
        </div>
        
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Buildings Layer */}
      <motion.div className={styles.buildingsLayer} style={{ y: buildingsY }}>
        <svg viewBox="0 0 1440 600" className={styles.cityscape}>
          {/* Background Buildings */}
          <g className={styles.buildingsBack}>
            <rect x="50" y="200" width="80" height="400" rx="4" fill="#1a1a2e" />
            <rect x="150" y="250" width="60" height="350" rx="4" fill="#16213e" />
            <rect x="230" y="180" width="100" height="420" rx="4" fill="#1a1a2e" />
            <rect x="350" y="220" width="70" height="380" rx="4" fill="#0f0f1a" />
            <rect x="440" y="150" width="90" height="450" rx="4" fill="#1a1a2e" />
            <rect x="550" y="200" width="80" height="400" rx="4" fill="#16213e" />
            <rect x="650" y="170" width="110" height="430" rx="4" fill="#1a1a2e" />
            <rect x="780" y="230" width="70" height="370" rx="4" fill="#0f0f1a" />
            <rect x="870" y="190" width="90" height="410" rx="4" fill="#1a1a2e" />
            <rect x="980" y="160" width="100" height="440" rx="4" fill="#16213e" />
            <rect x="1100" y="210" width="80" height="390" rx="4" fill="#1a1a2e" />
            <rect x="1200" y="180" width="90" height="420" rx="4" fill="#0f0f1a" />
            <rect x="1310" y="240" width="80" height="360" rx="4" fill="#1a1a2e" />
          </g>
          
          {/* Glowing Windows */}
          {[...Array(80)].map((_, i) => {
            const buildingX = [70, 170, 260, 370, 470, 580, 700, 800, 900, 1020, 1130, 1230, 1340];
            const bIdx = i % buildingX.length;
            return (
              <motion.rect
                key={i}
                x={buildingX[bIdx] + Math.random() * 40}
                y={220 + Math.random() * 300}
                width="8"
                height="12"
                rx="1"
                fill="#ffd700"
                className={styles.window}
                animate={{
                  opacity: [0.3, 0.9, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </svg>

        {/* Spider Webs between buildings */}
        <svg className={styles.webs} viewBox="0 0 1440 600">
          <motion.path
            d="M200 300 Q400 200 600 350"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
            animate={{ pathLength: [0.9, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.path
            d="M700 250 Q900 180 1100 300"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            fill="none"
            animate={{ pathLength: [0.85, 1, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.path
            d="M400 400 Q600 320 800 420"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
            animate={{ pathLength: [0.9, 1, 0.9] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Floating Hearts */}
      <div className={styles.heartsLayer}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.floatingHeart}
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: `-50px`,
            }}
            animate={{
              y: [0, -800],
              x: [0, Math.sin(i) * 50],
              opacity: [0, 0.8, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Sparkles */}
      <div className={styles.sparklesLayer}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.sparkle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Hero Character */}
      <motion.div 
        className={styles.heroCharacter}
        style={{ x: heroX, y: heroY }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Web String */}
        <motion.svg 
          className={styles.webString}
          viewBox="0 0 100 200"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M50 0 Q55 100 50 200"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            fill="none"
          />
        </motion.svg>
        
        {/* Chibi Hero Silhouette */}
        <motion.svg 
          className={styles.chibiHero}
          viewBox="0 0 120 150"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Body */}
          <ellipse cx="60" cy="100" rx="35" ry="40" fill="#e63946" />
          {/* Head */}
          <circle cx="60" cy="45" r="35" fill="#e63946" />
          {/* Eyes */}
          <ellipse cx="48" cy="42" rx="12" ry="15" fill="white" />
          <ellipse cx="72" cy="42" rx="12" ry="15" fill="white" />
          {/* Web pattern on suit */}
          <path d="M60 10 L60 80" stroke="#1a1a2e" strokeWidth="1" opacity="0.3" />
          <path d="M25 45 Q60 60 95 45" stroke="#1a1a2e" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M30 30 Q60 50 90 30" stroke="#1a1a2e" strokeWidth="1" fill="none" opacity="0.3" />
          {/* Cape/Arms out */}
          <ellipse cx="20" cy="90" rx="15" ry="10" fill="#e63946" />
          <ellipse cx="100" cy="90" rx="15" ry="10" fill="#e63946" />
          {/* Little heart on chest */}
          <text x="52" y="105" fontSize="20">❤️</text>
        </motion.svg>
      </motion.div>

      {/* Text Content */}
      <motion.div 
        className={styles.textContent}
        style={{ opacity: textOpacity }}
      >
        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          Every hero has a story…
        </motion.h1>
        <motion.p
          className={styles.subheading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          And mine began with you ❤️
        </motion.p>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div 
        className={styles.scrollHint}
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>Scroll to continue</span>
        <motion.span className={styles.arrow}>↓</motion.span>
      </motion.div>

      {/* Comic Stickers */}
      <motion.div
        className={styles.comicSticker}
        style={{
          top: '15%',
          left: '10%',
          backgroundColor: '#e63946',
          transform: 'rotate(-15deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '-20deg' }}
      >
        <span>SWING!</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          top: '25%',
          right: '15%',
          backgroundColor: '#ffd700',
          transform: 'rotate(10deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '15deg' }}
      >
        <span>HERO</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '30%',
          left: '20%',
          backgroundColor: '#457b9d',
          transform: 'rotate(-8deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '-12deg' }}
      >
        <span>NIGHT</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '20%',
          right: '10%',
          backgroundColor: '#e63946',
          transform: 'rotate(12deg)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: '17deg' }}
      >
        <span>WEB</span>
      </motion.div>
    </motion.section>
  );
};

export default Scene1Arrival;