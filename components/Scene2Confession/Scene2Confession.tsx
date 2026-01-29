'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './Scene2Confession.module.css';

interface Scene2Props {
  letter: {
    recipient: string;
    content: string;
    signature: string;
  };
}

const Scene2Confession: React.FC<Scene2Props> = ({ letter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const { scrollYProgress } = useScroll();
  const envelopeScale = useTransform(scrollYProgress, [0.15, 0.25], [0.8, 1]);
  const letterY = useTransform(scrollYProgress, [0.2, 0.35], [100, 0]);
  const letterOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);

  return (
    <section className={styles.scene} ref={ref}>
      {/* Paper Texture Background */}
      <div className={styles.paperBackground}></div>
      
      {/* Vignette */}
      <div className={styles.vignette}></div>

      {/* Coffee Stains */}
      <div className={styles.coffeeStain1}></div>
      <div className={styles.coffeeStain2}></div>

      {/* Doodle Hearts */}
      <svg className={styles.doodleHearts} viewBox="0 0 100 100">
        <path
          d="M10 20 C10 10, 20 10, 20 20 C20 10, 30 10, 30 20 C30 30, 20 40, 20 40 C20 40, 10 30, 10 20"
          fill="none"
          stroke="#ffb4b4"
          strokeWidth="0.5"
          className={styles.doodleHeart}
        />
      </svg>
      <svg className={styles.doodleHearts2} viewBox="0 0 100 100">
        <path
          d="M10 20 C10 10, 20 10, 20 20 C20 10, 30 10, 30 20 C30 30, 20 40, 20 40 C20 40, 10 30, 10 20"
          fill="none"
          stroke="#e63946"
          strokeWidth="0.5"
          className={styles.doodleHeart}
        />
      </svg>

      {/* Tape Corners */}
      <div className={styles.tapeCorner1}></div>
      <div className={styles.tapeCorner2}></div>
      <div className={styles.tapeCorner3}></div>
      <div className={styles.tapeCorner4}></div>

      {/* Envelope Container */}
      <motion.div 
        className={styles.envelopeContainer}
        style={{ scale: envelopeScale }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Envelope Back */}
        <div className={styles.envelopeBack}>
          {/* Envelope pattern */}
          <div className={styles.envelopePattern}></div>
        </div>

        {/* Letter Card */}
        <motion.div 
          className={`${styles.letterCard} ${isOpen ? styles.letterOpen : ''}`}
          style={{ 
            y: inView ? letterY : 100,
            opacity: inView ? letterOpacity : 0 
          }}
          animate={isOpen ? { y: -180, scale: 1.1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className={styles.letterContent}>
            {/* Decorative header */}
            <div className={styles.letterHeader}>
              <span className={styles.heartDeco}>♥</span>
              <span className={styles.heartDeco}>♥</span>
              <span className={styles.heartDeco}>♥</span>
            </div>

            <h2 className={styles.letterRecipient}>{letter.recipient},</h2>
            
            <div className={styles.letterText}>
              {letter.content.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>

            <p className={styles.letterSignature}>{letter.signature}</p>

            {/* Sparkles */}
            <motion.span 
              className={styles.letterSparkle1}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >✨</motion.span>
            <motion.span 
              className={styles.letterSparkle2}
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >✨</motion.span>
          </div>
        </motion.div>

        {/* Envelope Front (Flap) */}
        <motion.div 
          className={`${styles.envelopeFlap} ${isOpen ? styles.flapOpen : ''}`}
          animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.flapInner}></div>
        </motion.div>

        {/* Envelope Body Front */}
        <div className={styles.envelopeFront}>
          {/* Heart Seal */}
          <motion.div 
            className={styles.heartSeal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>❤️</span>
          </motion.div>
          
          {/* "Open Me" text */}
          {!isOpen && (
            <motion.p 
              className={styles.openMe}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              tap to open
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Floating Sparkles */}
      {inView && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.floatingSparkle}
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
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
    </section>
  );
};

export default Scene2Confession;
