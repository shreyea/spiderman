'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './SceneTransition.module.css';

interface SceneTransitionProps {
  fromScene: 'city' | 'diary';
  children?: React.ReactNode;
}

const SceneTransition: React.FC<SceneTransitionProps> = ({ fromScene }) => {
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0.12, 0.18], [0, 1]);
  const blur = useTransform(scrollYProgress, [0.1, 0.2], [0, 10]);
  
  if (fromScene === 'city') {
    return (
      <motion.div 
        className={styles.transitionOverlay}
        style={{ opacity }}
      >
        {/* Paper texture fade in */}
        <div className={styles.paperTexture}></div>
        
        {/* Floating sparkles transition */}
        <div className={styles.sparkleTransition}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.transitionSparkle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Hearts dissolving */}
        <div className={styles.heartsDissolve}>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.dissolvingHeart}
              style={{
                left: `${10 + Math.random() * 80}%`,
                bottom: `${Math.random() * 50}%`,
              }}
              animate={{
                opacity: [0.8, 0],
                scale: [1, 0.5],
                y: [0, -100],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 1.5,
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
};

export default SceneTransition;
