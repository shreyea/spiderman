'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './Scene4Reasons.module.css';

interface Reason {
  id: number;
  title: string;
  description: string;
  effect: string;
}

interface Scene4Props {
  reasons: Reason[];
}

const Scene4Reasons: React.FC<Scene4Props> = ({ reasons }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const getEffectColor = (effect: string) => {
    switch (effect) {
      case 'POW!': return '#e63946';
      case 'WOW!': return '#457b9d';
      case 'LOVE!': return '#ff69b4';
      case 'HERO!': return '#ffd700';
      case 'BOOM!': return '#ff6b35';
      default: return '#9b59b6';
    }
  };

  return (
    <section className={styles.scene} ref={ref}>
      {/* Comic dot pattern background */}
      <div className={styles.comicBackground}></div>
      <div className={styles.halftoneOverlay}></div>

      {/* Section Title */}
      <motion.div 
        className={styles.titleContainer}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleBubble}>Reasons I Love You</span>
        </h2>
        <div className={styles.titleUnderline}></div>
      </motion.div>

      {/* Comic Panels Grid */}
      <div className={styles.panelsContainer}>
        {reasons.map((reason, index) => (
          <motion.div
            key={reason.id}
            className={styles.comicPanel}
            initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -3 : 3 }}
            animate={inView ? { 
              opacity: 1, 
              y: 0,
              rotate: 0,
            } : { opacity: 0, y: 60 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.12,
              type: 'spring',
              stiffness: 100,
              damping: 12
            }}
            whileHover={{ 
              scale: 1.03,
              rotate: [-1, 1, 0],
              transition: { duration: 0.3 }
            }}
          >
            {/* Effect Burst */}
            <motion.div 
              className={styles.effectBurst}
              style={{ 
                '--burst-color': getEffectColor(reason.effect) 
              } as React.CSSProperties}
              initial={{ scale: 0, rotate: -20 }}
              animate={inView ? { scale: 1, rotate: 0 } : { scale: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.12 + 0.3,
                type: 'spring',
                stiffness: 200
              }}
            >
              <span className={styles.effectText}>{reason.effect}</span>
            </motion.div>

            {/* Panel Content */}
            <div className={styles.panelContent}>
              {/* Heart Icon */}
              <motion.div 
                className={styles.heartIcon}
                animate={{ 
                  scale: [1, 1.15, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              >
                ❤️
              </motion.div>

              <h3 className={styles.reasonTitle}>{reason.title}</h3>
              
              {/* Speech Bubble */}
              <div className={styles.speechBubble}>
                <p className={styles.reasonDescription}>{reason.description}</p>
                <div className={styles.bubbleTail}></div>
              </div>
            </div>

            {/* Panel decorations */}
            <div className={styles.panelBorder}></div>
            
            {/* Action lines */}
            <svg className={styles.actionLines} viewBox="0 0 100 100">
              <line x1="0" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="2" />
              <line x1="85" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="0" x2="50" y2="15" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="85" x2="50" y2="100" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="10" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
              <line x1="80" y1="80" x2="90" y2="90" stroke="currentColor" strokeWidth="2" />
              <line x1="80" y1="10" x2="90" y2="20" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="80" x2="20" y2="90" stroke="currentColor" strokeWidth="2" />
            </svg>

            {/* Sparkle accents */}
            <motion.span 
              className={styles.panelSparkle1}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >✨</motion.span>
            <motion.span 
              className={styles.panelSparkle2}
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 + 0.5 }}
            >✨</motion.span>
          </motion.div>
        ))}
      </div>

      {/* Floating Comic Elements */}
      {inView && (
        <>
          <motion.div 
            className={styles.floatingPow}
            animate={{ 
              y: [0, -15, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            💥
          </motion.div>
          <motion.div 
            className={styles.floatingZap}
            animate={{ 
              y: [0, -10, 0],
              rotate: [5, -5, 5],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          >
            ⚡
          </motion.div>
          <motion.div 
            className={styles.floatingStar}
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            ⭐
          </motion.div>
        </>
      )}
    </section>
  );
};

export default Scene4Reasons;
