'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, MessageCircle, Camera, Sparkles, Send } from 'lucide-react';
import styles from './ComicLoveMessage.module.css';

interface ComicLoveMessageProps {
  recipientName?: string;
  message?: string;
}

const ComicLoveMessage: React.FC<ComicLoveMessageProps> = ({
  recipientName = '[Name]',
  message = 'Even heroes fall in love.\nSomehow you became my favorite adventure.',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const { scrollYProgress } = useScroll();
  const cardY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);
  const cardScale = useTransform(scrollYProgress, [0.2, 0.35], [0.8, 1]);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsRevealed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  // Speech bubble messages
  const speechBubbles = [
    { text: 'My Heart!', left: '5%', top: '20%', delay: 0.5 },
    { text: 'Forever', left: '85%', top: '30%', delay: 0.8 },
    { text: 'Always', left: '10%', top: '70%', delay: 1.1 },
  ];

  return (
    <section className={styles.scene} ref={ref}>
      {/* Comic Texture Background */}
      <div className={styles.comicBackground}>
        <div className={styles.dotsPattern} />
        <div className={styles.linesPattern} />
      </div>

      {/* Vignette */}
      <div className={styles.vignette} />

      {/* Web Connection to Top */}
      <motion.div
        className={styles.webConnection}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 40 400" className={styles.webSvg}>
          <motion.path
            d="M20 0 Q15 100, 20 200 Q25 300, 20 400"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            fill="none"
            animate={{
              d: [
                'M20 0 Q15 100, 20 200 Q25 300, 20 400',
                'M20 0 Q25 100, 20 200 Q15 300, 20 400',
                'M20 0 Q15 100, 20 200 Q25 300, 20 400',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M20 0 Q10 100, 20 200 Q30 300, 20 400"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            fill="none"
            animate={{
              d: [
                'M20 0 Q10 100, 20 200 Q30 300, 20 400',
                'M20 0 Q30 100, 20 200 Q10 300, 20 400',
                'M20 0 Q10 100, 20 200 Q30 300, 20 400',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Speech Bubbles */}
      <AnimatePresence>
        {inView &&
          speechBubbles.map((bubble, index) => (
            <motion.div
              key={index}
              className={styles.speechBubble}
              style={{ left: bubble.left, top: bubble.top }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                delay: bubble.delay,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <span>{bubble.text}</span>
              <div className={styles.bubbleTail} />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Floating Stickers */}
      <motion.div
        className={styles.sticker}
        style={{ left: '8%', top: '45%' }}
        initial={{ rotate: -20, scale: 0 }}
        animate={inView ? { rotate: -15, scale: 1 } : { scale: 0 }}
        transition={{ delay: 1.5, type: 'spring' }}
      >
        XOXO
      </motion.div>
      
      <motion.div
        className={styles.sticker}
        style={{ right: '8%', top: '55%', background: '#e63946' }}
        initial={{ rotate: 15, scale: 0 }}
        animate={inView ? { rotate: 10, scale: 1 } : { scale: 0 }}
        transition={{ delay: 1.8, type: 'spring' }}
      >
        BE MINE
      </motion.div>

      {/* Main Card Container */}
      <motion.div
        className={styles.cardContainer}
        style={{ y: cardY, scale: cardScale }}
      >
        {/* Card */}
        <motion.div
          className={styles.loveCard}
          initial={{ rotateY: -15, opacity: 0 }}
          animate={
            inView
              ? {
                  rotateY: 0,
                  opacity: 1,
                }
              : { rotateY: -15, opacity: 0 }
          }
          transition={{
            delay: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Glow Border */}
          <motion.div
            className={styles.glowBorder}
            animate={{
              boxShadow: [
                '0 0 20px rgba(230, 57, 70, 0.4)',
                '0 0 40px rgba(230, 57, 70, 0.6)',
                '0 0 20px rgba(230, 57, 70, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Card Header */}
          <div className={styles.cardHeader}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={32} fill="#e63946" color="#e63946" />
            </motion.div>
            <div className={styles.headerLine} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              <Heart size={32} fill="#e63946" color="#e63946" />
            </motion.div>
          </div>

          {/* Card Content */}
          <div className={styles.cardContent}>
            <motion.h2
              className={styles.recipient}
              initial={{ x: -30, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              Dear {recipientName},
            </motion.h2>

            <motion.div
              className={styles.messageContainer}
              initial={{ opacity: 0 }}
              animate={isRevealed ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {message.split('\n').map((line, i) => (
                <motion.p
                  key={i}
                  className={styles.messageLine}
                  initial={{ y: 20, opacity: 0 }}
                  animate={isRevealed ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 1.2 + i * 0.3 }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>

            {/* Decorative Elements */}
            <div className={styles.decorativeCorner1} />
            <div className={styles.decorativeCorner2} />
          </div>

          {/* Card Footer */}
          <div className={styles.cardFooter}>
            <motion.div
              className={styles.footerIcon}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={20} color="#ffd700" />
            </motion.div>
            <span className={styles.footerText}>With all my love</span>
            <motion.div
              className={styles.footerIcon}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles size={20} color="#ffd700" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Lucide Icons */}
      <motion.div
        className={styles.floatingIcon}
        style={{ left: '15%', top: '25%' }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Heart size={40} color="#e63946" fill="#e63946" />
      </motion.div>

      <motion.div
        className={styles.floatingIcon}
        style={{ right: '15%', top: '35%' }}
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        <MessageCircle size={36} color="#ffb4b4" />
      </motion.div>

      <motion.div
        className={styles.floatingIcon}
        style={{ left: '20%', bottom: '25%' }}
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      >
        <Camera size={32} color="#fff" />
      </motion.div>

      <motion.div
        className={styles.floatingIcon}
        style={{ right: '18%', bottom: '30%' }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
      >
        <Send size={28} color="#ffd700" />
      </motion.div>

      {/* Comic Action Lines */}
      <svg className={styles.actionLines} viewBox="0 0 100 100" preserveAspectRatio="none">
        {[...Array(12)].map((_, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="50"
            x2={50 + Math.cos((i * 30 * Math.PI) / 180) * 60}
            y2={50 + Math.sin((i * 30 * Math.PI) / 180) * 60}
            stroke="rgba(230, 57, 70, 0.1)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
          />
        ))}
      </svg>
    </section>
  );
};

export default ComicLoveMessage;
