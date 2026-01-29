'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './Scene6Final.module.css';

interface Scene6Props {
  finalMessage: {
    question: string;
    yesButton: string;
    alwaysButton: string;
  };
}

const Scene6Final: React.FC<Scene6Props> = ({ finalMessage }) => {
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const handleAnswer = (choice: string) => {
    setAnswer(choice);
    setAnswered(true);
  };

  return (
    <section className={styles.scene} ref={ref}>
      {/* Starry Background */}
      <div className={styles.starsBackground}>
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
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
      </div>

      {/* Ambient Glow */}
      <div className={styles.ambientGlow}></div>

      {/* Web Heart Structure */}
      <motion.div 
        className={styles.webHeartContainer}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <svg viewBox="0 0 300 280" className={styles.webHeart}>
          <defs>
            <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="webGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
              <stop offset="100%" stopColor="#e63946" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Web strings forming heart shape */}
          <g filter="url(#heartGlow)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none">
            {/* Outer heart outline made of web */}
            <motion.path
              d="M150 250 C80 200 20 140 20 80 C20 35 55 10 95 10 C120 10 140 25 150 45 C160 25 180 10 205 10 C245 10 280 35 280 80 C280 140 220 200 150 250 Z"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            {/* Inner web patterns */}
            <motion.path
              d="M150 45 L150 200"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1 }}
            />
            <motion.path
              d="M60 80 L240 80"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            <motion.path
              d="M80 130 L220 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            />
            <motion.path
              d="M100 180 L200 180"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
            />
            
            {/* Diagonal web strings */}
            <motion.path
              d="M95 10 L150 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            />
            <motion.path
              d="M205 10 L150 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
            />
            <motion.path
              d="M20 80 L150 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            />
            <motion.path
              d="M280 80 L150 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            />
            <motion.path
              d="M80 200 L150 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            />
            <motion.path
              d="M220 200 L150 130"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
            />
          </g>

          {/* Center glow */}
          <motion.circle
            cx="150"
            cy="130"
            r="20"
            fill="url(#webGradient)"
            filter="url(#heartGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { 
              scale: [1, 1.2, 1], 
              opacity: 1 
            } : { scale: 0, opacity: 0 }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              opacity: { duration: 0.5, delay: 3 }
            }}
          />
        </svg>

        {/* Glowing particles around heart */}
        {inView && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.heartParticle}
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </motion.div>

      {/* Question Text */}
      <motion.h2 
        className={styles.question}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, delay: 2 }}
      >
        {finalMessage.question}
      </motion.h2>

      {/* Answer Buttons */}
      {!answered && (
        <motion.div 
          className={styles.buttonsContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <motion.button
            className={styles.answerButton}
            onClick={() => handleAnswer('yes')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(230, 57, 70, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [
                '0 0 15px rgba(230, 57, 70, 0.3)',
                '0 0 25px rgba(230, 57, 70, 0.5)',
                '0 0 15px rgba(230, 57, 70, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {finalMessage.yesButton}
          </motion.button>
          <motion.button
            className={`${styles.answerButton} ${styles.alwaysButton}`}
            onClick={() => handleAnswer('always')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [
                '0 0 15px rgba(255, 215, 0, 0.3)',
                '0 0 25px rgba(255, 215, 0, 0.5)',
                '0 0 15px rgba(255, 215, 0, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {finalMessage.alwaysButton}
          </motion.button>
        </motion.div>
      )}

      {/* Celebration Animation */}
      <AnimatePresence>
        {answered && (
          <>
            {/* Celebration Message */}
            <motion.div
              className={styles.celebrationMessage}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <h3>
                {answer === 'always' 
                  ? '💍 Forever & Always 💍' 
                  : '❤️ I Love You Too ❤️'}
              </h3>
              <p>You've made me the happiest person in the universe ✨</p>
            </motion.div>

            {/* Confetti */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className={styles.confetti}
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#e63946', '#ff69b4', '#ffd700', '#ff6b6b', '#ffb4b4'][Math.floor(Math.random() * 5)],
                }}
                initial={{ y: -20, opacity: 1 }}
                animate={{
                  y: window.innerHeight + 100,
                  x: Math.sin(i) * 100,
                  rotate: Math.random() * 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeIn',
                }}
              />
            ))}

            {/* Hearts Rain */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`heart-rain-${i}`}
                className={styles.heartRain}
                style={{
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -50, opacity: 1 }}
                animate={{
                  y: window.innerHeight + 100,
                  x: Math.sin(i) * 50,
                  rotate: [0, 360],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  delay: Math.random() * 1,
                  ease: 'easeIn',
                }}
              >
                {['❤️', '💕', '💖', '💗', '✨', '⭐'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}

            {/* Sparkle Burst */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                className={styles.sparkleBurst}
                style={{
                  left: '50%',
                  top: '40%',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 20) * Math.PI * 2) * 200,
                  y: Math.sin((i / 20) * Math.PI * 2) * 200,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 0.3,
                  ease: 'easeOut',
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Scene6Final;
