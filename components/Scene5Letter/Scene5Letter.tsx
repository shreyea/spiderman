'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene5Letter.module.css';

interface Scene5LetterProps {
  name?: string;
}

const Scene5Letter: React.FC<Scene5LetterProps> = ({ name = '[Name]' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.3 });

  const letterContent = `Dear ${name},

Even heroes fall in love.
Somehow you became my favorite part of every day.

With all my heart,
Your Hero`;

  return (
    <section className={styles.letterSection} ref={ref}>
      {/* Background */}
      <div className={styles.backgroundContainer}>
        <img src="/images/back.jpg" alt="Background" className={styles.backgroundImage} />
        <div className={styles.pastelOverlay} />
        <div className={styles.grainTexture} />
      </div>

      {/* Decorative tape stickers */}
      <motion.div
        className={`${styles.tapeSticker} ${styles.tape1}`}
        initial={{ scale: 0, rotate: -30 }}
        animate={inView ? { scale: 1, rotate: -15 } : {}}
        transition={{ delay: 0.5, type: 'spring' }}
      />
      <motion.div
        className={`${styles.tapeSticker} ${styles.tape2}`}
        initial={{ scale: 0, rotate: 30 }}
        animate={inView ? { scale: 1, rotate: 12 } : {}}
        transition={{ delay: 0.7, type: 'spring' }}
      />
      <motion.div
        className={`${styles.tapeSticker} ${styles.tape3}`}
        initial={{ scale: 0, rotate: -20 }}
        animate={inView ? { scale: 1, rotate: -8 } : {}}
        transition={{ delay: 0.9, type: 'spring' }}
      />

      {/* Doodle hearts */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`doodle-${i}`}
          className={styles.doodleHeart}
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Floating Lucide Icons */}
      <motion.div
        className={styles.floatingIcon}
        style={{ top: '15%', left: '8%' }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Heart size={32} fill="#e63946" color="#e63946" />
      </motion.div>
      <motion.div
        className={styles.floatingIcon}
        style={{ top: '20%', right: '10%' }}
        animate={{
          y: [0, -12, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles size={28} color="#ffd700" />
      </motion.div>
      <motion.div
        className={styles.floatingIcon}
        style={{ bottom: '25%', left: '12%' }}
        animate={{
          y: [0, -10, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      >
        <Star size={24} fill="#ffd700" color="#ffd700" />
      </motion.div>
      <motion.div
        className={styles.floatingIcon}
        style={{ bottom: '30%', right: '15%' }}
        animate={{
          y: [0, -8, 0],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 0.8 }}
      >
        <Heart size={26} fill="#ffb4b4" color="#ffb4b4" />
      </motion.div>

      {/* Web string holding the letter */}
      <motion.svg
        className={styles.webString}
        viewBox="0 0 50 200"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <path
          d="M 25 0 Q 20 50, 25 100 Q 30 150, 25 200"
          fill="none"
          stroke="#e63946"
          strokeWidth="2"
        />
        <circle cx="25" cy="200" r="5" fill="#e63946" />
        {/* Web pattern details */}
        <path
          d="M 15 50 Q 25 55, 35 50"
          fill="none"
          stroke="#e63946"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 12 100 Q 25 108, 38 100"
          fill="none"
          stroke="#e63946"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 15 150 Q 25 155, 35 150"
          fill="none"
          stroke="#e63946"
          strokeWidth="1"
          opacity="0.5"
        />
      </motion.svg>

      {/* Letter Card */}
      <motion.div
        className={`${styles.letterContainer} ${isZoomed ? styles.zoomed : ''}`}
        initial={{ y: -300, opacity: 0, rotate: -10 }}
        animate={inView ? { 
          y: 0, 
          opacity: 1, 
          rotate: isHovered ? 0 : -3,
        } : {}}
        transition={{
          delay: 0.4,
          type: 'spring',
          stiffness: 60,
          damping: 12,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {/* Floating animation */}
        <motion.div
          className={styles.letterInner}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Letter image */}
          <div className={styles.letterImageWrap}>
            <img 
              src="/images/letter.jpg" 
              alt="Love Letter" 
              className={styles.letterImage}
              data-sticky
            />
            <div className={styles.letterShine} />
          </div>

          {/* Letter text overlay */}
          <div className={styles.letterTextOverlay}>
            <pre className={styles.letterText}>{letterContent}</pre>
          </div>

          {/* Glow effect on hover */}
          <motion.div
            className={styles.glowEffect}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Zoom backdrop */}
      {isZoomed && (
        <motion.div
          className={styles.zoomBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsZoomed(false)}
        />
      )}

      {/* Comic stickers */}
      <motion.div
        className={styles.sticker}
        style={{ bottom: '15%', left: '8%', rotate: -12 }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
      >
        XOXO
      </motion.div>
      <motion.div
        className={styles.sticker}
        style={{ top: '70%', right: '10%', rotate: 8, background: '#d4edda' }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.4, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
      >
        SWEET
      </motion.div>
    </section>
  );
};

export default Scene5Letter;
