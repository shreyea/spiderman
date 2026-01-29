'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './Scene3Memories.module.css';

interface Memory {
  id: number;
  image: string;
  caption: string;
  rotation: number;
}

interface Scene3Props {
  memories: Memory[];
}

const Scene3Memories: React.FC<Scene3Props> = ({ memories }) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  return (
    <section className={styles.scene} ref={ref}>
      {/* Background */}
      <div className={styles.background}></div>
      <div className={styles.grainOverlay}></div>

      {/* Decorative Web Lines */}
      <svg className={styles.webLines} viewBox="0 0 1200 800">
        <motion.path
          d="M0 100 Q300 50 600 100 Q900 150 1200 100"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2 }}
        />
        <motion.path
          d="M0 300 Q400 250 700 300 Q1000 350 1200 300"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2, delay: 0.3 }}
        />
        <motion.path
          d="M0 500 Q350 450 650 500 Q950 550 1200 500"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2, delay: 0.6 }}
        />
        {/* Vertical web strands */}
        {[100, 300, 500, 700, 900, 1100].map((x, i) => (
          <motion.path
            key={i}
            d={`M${x} 0 Q${x + 20} 400 ${x} 800`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay: 0.1 * i }}
          />
        ))}
      </svg>

      {/* Section Title */}
      <motion.h2 
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        Our Memories ✨
      </motion.h2>

      {/* Polaroids Grid */}
      <div className={styles.polaroidsContainer}>
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            className={styles.polaroidWrapper}
            initial={{ opacity: 0, y: 50, rotate: memory.rotation }}
            animate={inView ? { 
              opacity: 1, 
              y: 0,
              rotate: memory.rotation,
            } : { opacity: 0, y: 50 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: 'easeOut'
            }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0,
              zIndex: 10,
              transition: { duration: 0.3 }
            }}
            onClick={() => setSelectedMemory(memory)}
          >
            {/* Web string attachment */}
            <motion.div 
              className={styles.webAttachment}
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 20 40" className={styles.webStringSmall}>
                <path
                  d="M10 0 Q12 20 10 40"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </motion.div>

            <motion.div 
              className={styles.polaroid}
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                duration: 4 + index * 0.5, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: index * 0.3
              }}
            >
              {/* Photo Area */}
              <div className={styles.photoArea}>
                {/* Placeholder image - gradient with icon */}
                <div className={styles.photoPlaceholder}>
                  <span className={styles.photoIcon}>📸</span>
                  <span className={styles.photoNumber}>#{memory.id}</span>
                </div>
              </div>
              
              {/* Caption */}
              <p className={styles.caption}>{memory.caption}</p>

              {/* Corner decorations */}
              <div className={styles.cornerDeco1}></div>
              <div className={styles.cornerDeco2}></div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Floating Hearts */}
      {inView && [...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.floatingHeart}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          💕
        </motion.div>
      ))}

      {/* Modal for selected memory */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalPhoto}>
                <div className={styles.photoPlaceholder}>
                  <span className={styles.photoIconLarge}>📸</span>
                  <span className={styles.photoNumberLarge}>Memory #{selectedMemory.id}</span>
                </div>
              </div>
              <p className={styles.modalCaption}>{selectedMemory.caption}</p>
              <motion.button 
                className={styles.closeButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMemory(null)}
              >
                ✕
              </motion.button>
              
              {/* Sparkles around modal */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className={styles.modalSparkle}
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${5 + Math.random() * 90}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ✨
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Scene3Memories;
