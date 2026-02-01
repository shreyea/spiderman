'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useInView } from 'react-intersection-observer';
import styles from './SceneLetter.module.css';
import { useContent } from '../../context/ContentContext';
import InlineEditor from '../InlineEditor/InlineEditor';
import { Heart, Sparkles, Star, MessageCircle, Camera, Zap, LucideIcon } from 'lucide-react';

// Helper component for floating icons
interface FloatingIconProps {
  Icon: LucideIcon;
  delay: number;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  color: string;
  size: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ Icon, delay, left, right, top, bottom, color, size }) => (
  <motion.div
    className={styles.floatingIcon}
    style={{ left, right, top, bottom }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.7, scale: 1 }}
    transition={{ delay, duration: 0.5, type: 'spring' }}
  >
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Icon size={size} color={color} />
    </motion.div>
  </motion.div>
);

const SceneLetter: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [isOpen, setIsOpen] = useState(false);
  const { content, updateContent, isEditor } = useContent();

  // Floating hearts configuration
  const floatingHearts = [
    { left: '8%', top: '15%', size: 32, delay: 0.5, color: 'var(--color-primary)' },
    { left: '12%', top: '45%', size: 24, delay: 0.8, color: 'var(--color-pink)' },
    { left: '18%', top: '75%', size: 28, delay: 1.1, color: '#ff6b7a' },
    { right: '10%', top: '20%', size: 26, delay: 0.6, color: '#ffd700' },
    { right: '15%', top: '50%', size: 30, delay: 0.9, color: 'var(--color-primary)' },
    { right: '8%', top: '70%', size: 22, delay: 1.2, color: 'var(--color-pink)' },
    { left: '25%', top: '35%', size: 20, delay: 1.5, color: '#ff8fab' },
    { right: '25%', top: '65%', size: 24, delay: 1.3, color: '#ffd700' },
  ];

  // Sparkle stickers for opening effect
  const sparklePositions = [
    { left: '10%', top: '20%', delay: 0.1 },
    { right: '15%', top: '25%', delay: 0.2 },
    { left: '15%', bottom: '30%', delay: 0.3 },
    { right: '10%', bottom: '25%', delay: 0.4 },
  ];

  // Letter content - editable
  const defaultLetterText = `Dear Love,

Even heroes fall in love...
and somehow, you became my favorite story.

Every moment with you feels like
a page from a comic I never want to end.

You are my greatest adventure,
my sweetest chapter,
and my happiest ending.

Forever yours,
Your Spider ❤️`;

  const letterText = content.letterText || defaultLetterText;

  return (
    <section className={styles.letterSection} ref={ref}>
      {/* Background Image - Lighter gradient */}
      <div className={styles.backgroundImage}>
        <img src="/images/back1.jpg" alt="Background" />
      </div>

      {/* Overlays */}
      <div className={styles.softOverlay} />
      <div className={styles.paperTexture} />
      <div className={styles.grainOverlay} />

      {/* Background blur when letter is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.backgroundBlur}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isEditor ? (
            <InlineEditor
              text={content.letterTitle || 'A Love Letter'}
              isEditor={isEditor}
              onSave={(newTitle) => updateContent({ letterTitle: newTitle })}
            />
          ) : (
            content.letterTitle || 'A Love Letter'
          )}
        </motion.h2>

        {/* Comic Book Container */}
        <motion.div
          className={`${styles.comicBookContainer} ${isOpen ? styles.opened : ''}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {/* Closed State - Book cover */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className={styles.bookCover}
                exit={{
                  rotateY: -90,
                  opacity: 0,
                  transition: { duration: 0.6, ease: 'easeInOut' }
                }}
              >
                <img src="/images/cover.png" alt="Love Letter" className={styles.bookCoverImage} />
                <div className={styles.bookCoverOverlay} />
                <motion.div
                  className={styles.clickToOpen}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart size={22} fill="var(--color-primary)" />
                  <span>Click to Open</span>
                </motion.div>

                {/* Glow effect on hover */}
                <motion.div
                  className={styles.coverGlow}
                  whileHover={{ opacity: 0.8 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Open State - Letter inside */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Left Page */}
                <motion.div
                  className={styles.pageLeft}
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
                >
                  <div className={styles.pageFold} />
                  <motion.img
                    src="/stickers/spi.png"
                    alt="Sticker"
                    className={styles.pageSticker}
                    style={{ top: '10%', left: '5%', width: '60px' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: -10 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                  />
                  <motion.div
                    className={styles.heartsDecor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Heart size={30} fill="var(--color-primary)" />
                    <Heart size={22} fill="var(--color-pink)" />
                    <Heart size={26} fill="var(--color-primary)" />
                  </motion.div>
                </motion.div>

                {/* Right Page - Letter content */}
                <motion.div
                  className={styles.pageRight}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8, type: 'spring', stiffness: 80, delay: 0.1 }}
                >
                  <div className={styles.pageFold} />
                  <motion.div
                    className={styles.letterContent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {isEditor ? (
                      <InlineEditor
                        text={letterText}
                        isEditor={isEditor}
                        onSave={(newText) => updateContent({ letterText: newText })}
                        multiline={true}
                      />
                    ) : (
                      letterText.split('\n').map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.05 }}
                        >
                          {line || '\u00A0'}
                        </motion.p>
                      ))
                    )}
                  </motion.div>

                  <motion.img
                    src="/stickers/aesthetic_heart_sticker___Pink_Web_Heart_Sticker-removebg-preview.png"
                    alt="Heart Sticker"
                    className={styles.pageSticker}
                    style={{ bottom: '8%', right: '5%', width: '55px' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 8 }}
                    transition={{ delay: 1.2, type: 'spring' }}
                  />
                </motion.div>

                {/* Sparkle effects */}
                {sparklePositions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className={styles.sparkleEffect}
                    style={pos}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                    transition={{ delay: 0.6 + pos.delay, duration: 0.5 }}
                  >
                    <Sparkles size={24} color="var(--color-gold)" />
                  </motion.div>
                ))}

                {/* Close button */}
                <motion.button
                  className={styles.closeButton}
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint text */}
        {!isOpen && (
          <motion.p
            className={styles.hintText}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            ❤️ Tap to read my love letter ❤️
          </motion.p>
        )}
      </div>

      {/* Corner Stickers with bouncy/windy animations */}
      <motion.img
        src="/stickers/web1.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '5%', left: '18%' }}
        initial={{ scale: 0, rotate: -15 }}
        animate={inView ? {
          scale: 1,
          rotate: [-8, -3, -8],
          y: [0, -6, 0],
        } : {}}
        transition={{
          delay: 0.6,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/spi2.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '13%', right: '19%', width: '95px' }}
        initial={{ scale: 0, rotate: 15 }}
        animate={inView ? {
          scale: 1,
          rotate: [10, 15, 10],
          y: [0, 5, 0],
        } : {}}
        transition={{
          delay: 0.8,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/sleep.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ bottom: '15%', right: '15%', width: '95px' }}
        initial={{ scale: 0, rotate: -10 }}
        animate={inView ? {
          scale: [1, 1.08, 1],
          rotate: [5, 10, 5],
        } : {}}
        transition={{
          delay: 1,
          type: 'spring',
          stiffness: 150,
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/spi.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ bottom: '15%', left: '18%', width: '90px' }}
        initial={{ scale: 0, rotate: 10 }}
        animate={inView ? {
          scale: [1, 1.1, 1],
          rotate: [-5, 0, -5],
          y: [0, -8, 0],
        } : {}}
        transition={{
          delay: 1.2,
          type: 'spring',
          stiffness: 130,
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Text Stickers */}
      <motion.div
        className={`${styles.textSticker} ${styles.stickerLove}`}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.4, type: 'spring' }}
        style={{ fontSize: '1.3rem', padding: '0.7rem 1.4rem' }}
      >
        MY LOVE
      </motion.div>
      <motion.div
        className={`${styles.textSticker} ${styles.stickerForever}`}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.6, type: 'spring' }}
        style={{ fontSize: '1.3rem', padding: '0.7rem 1.4rem' }}
      >
        ALWAYS
      </motion.div>
       <FloatingIcon Icon={Heart} delay={0} left="5%" top="20%" color="#e63946" size={32} />
        <FloatingIcon Icon={Sparkles} delay={0.3} left="92%" top="40%" color="#ffd700" size={28} />
        <FloatingIcon Icon={Star} delay={0.6} left="10%" top="75%" color="#ffd700" size={24} />
        <FloatingIcon Icon={MessageCircle} delay={0.9} left="88%" top="80%" color="#ffb4b4" size={26} />
        <FloatingIcon Icon={Camera} delay={1.2} left="50%" top="15%" color="#fff" size={30} />
        <FloatingIcon Icon={Zap} delay={1.5} left="25%" top="85%" color="#ffd700" size={22} />
    </section>
  );
};

export default SceneLetter;