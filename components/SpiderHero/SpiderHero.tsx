'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, MessageCircle, Camera, Zap } from 'lucide-react';
import styles from './SpiderHero.module.css';
import { useContent } from '../../context/ContentContext';
import InlineEditor from '../InlineEditor/InlineEditor';

interface HangingImageProps {
  src: string;
  webSrc: string;
  delay: number;
  finalY: number;
  finalRotate: number;
  left: string;
  zIndex: number;
  isBouncy?: boolean;
  id: string;
}

const HangingImage: React.FC<HangingImageProps> = ({
  src,
  webSrc,
  delay,
  finalY,
  finalRotate,
  left,
  zIndex,
  isBouncy,
  id,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasDropped(true), delay * 1000 + 2000);
    return () => clearTimeout(timer);
  }, [delay]);

  const swayAnimation = {
    rotate: [finalRotate - 3, finalRotate + 3, finalRotate - 3],
    x: [-5, 5, -5],
  };

  const springConfig = { stiffness: 100, damping: 10 };

  return (
    <motion.div
      className={styles.hangingImageContainer}
      style={{ left, zIndex }}
      initial={{ y: -600, opacity: 0 }}
      animate={
        hasDropped
          ? {
            y: finalY,
            opacity: 1,
            rotate: finalRotate,
          }
          : { y: -600, opacity: 0 }
      }
      transition={
        isBouncy
          ? {
            delay,
            type: 'spring',
            stiffness: 120,
            damping: 8,
            mass: 1.2,
          }
          : {
            delay,
            type: 'spring',
            stiffness: 80,
            damping: 12,
          }
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
    >

      {/* Image Frame */}
      <motion.div
        className={styles.imageFrame}
        animate={
          isClicked
            ? { scale: 1.2, zIndex: 100 }
            : isHovered
              ? { scale: 1.05 }
              : hasDropped
                ? swayAnimation
                : {}
        }
        transition={
          isClicked
            ? { type: 'spring', ...springConfig }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
        whileHover={{ boxShadow: '0 0 30px rgba(230, 57, 70, 0.6)' }}
      >
        <img src={src} alt={`Memory ${id}`} className={styles.hangingImage} />
        <div className={styles.imageOverlay} />
      </motion.div>
    </motion.div>
  );
};

// Comic Sticker Component
const ComicSticker: React.FC<{
  text: string;
  color: string;
  rotation: number;
  delay: number;
  left: string;
  top: string;
}> = ({ text, color, rotation, delay, left, top }) => (
  <motion.div
    className={styles.comicSticker}
    style={{
      backgroundColor: color,
      left,
      top,
      rotate: rotation,
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      delay: delay + 3,
      type: 'spring',
      stiffness: 200,
      damping: 10,
    }}
    whileHover={{ scale: 1.1, rotate: rotation + 5 }}
  >
    <span>{text}</span>
  </motion.div>
);

// Floating Icon Component
const FloatingIcon: React.FC<{
  Icon: React.ElementType;
  delay: number;
  left: string;
  top: string;
  color: string;
  size: number;
}> = ({ Icon, delay, left, top, color, size }) => (
  <motion.div
    className={styles.floatingIcon}
    style={{ left, top, color }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.6, 1, 0.6],
      scale: [0.9, 1.1, 0.9],
      y: [0, -15, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      delay: delay + 3.5,
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Icon size={size} strokeWidth={2.5} />
  </motion.div>
);

// Ambient Particle Component
const AmbientParticle: React.FC<{ type: 'heart' | 'dot' | 'star'; index: number }> = ({
  type,
  index,
}) => {
  const particleStyles = {
    heart: styles.particleHeart,
    dot: styles.particleDot,
    star: styles.particleStar,
  };

  return (
    <motion.div
      className={`${styles.ambientParticle} ${particleStyles[type]}`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, Math.sin(index) * 30, 0],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: 'easeInOut',
      }}
    />
  );
};

const SpiderHero: React.FC = () => {
  const [showImages, setShowImages] = useState(false);
  const [bgPushed, setBgPushed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const webParallax = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 0.9]);

  // Start animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImages(true);
      setBgPushed(true);
    }, 2500);
    const resetTimer = setTimeout(() => {
      setBgPushed(false);
    }, 4000); // Reset bg to full screen after 4 seconds
    return () => {
      clearTimeout(timer);
      clearTimeout(resetTimer);
    };
  }, []);

  const { content, updateContent, isEditor } = useContent();

  const hangingImages = [
    {
      id: 's1',
      src: '/images/s1.png',
      webSrc: '/images/web1.png',
      delay: 0,
      finalY: 80,
      finalRotate: -8,
      left: '15%',
      zIndex: 3,
      isBouncy: false,
    },
    {
      id: 's2',
      src: '/images/s2.png',
      webSrc: '/images/web2.png',
      delay: 0.3,
      finalY: 120,
      finalRotate: 5,
      left: '45%',
      zIndex: 5,
      isBouncy: true, // Bouncy animation for s2
    },
    {
      id: 's3',
      src: '/images/s3.png',
      webSrc: '/images/web1.png',
      delay: 0.6,
      finalY: 60,
      finalRotate: 12,
      left: '72%',
      zIndex: 4,
      isBouncy: false,
    },
  ];

  return (
    <section className={styles.heroSection} ref={containerRef}>
      {/* Background Image */}
      <motion.div
        className={styles.backgroundContainer}
        style={{ y: bgY }}
        animate={bgPushed ? { y: 100, scale: 1.05 } : { y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img src="/images/bg.png" alt="Background" className={styles.backgroundImage} />
        <motion.div
          className={styles.darkOverlay}
          style={{ opacity: overlayOpacity }}
        />
        <div className={styles.vignetteOverlay} />
        <div className={styles.grainTexture} />
      </motion.div>

      {/* Comic Halftone Background (fades in after images settle) */}
      <motion.div
        className={styles.comicBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: showImages ? 0.15 : 0 }}
        transition={{ delay: 4, duration: 2 }}
      />

      {/* Ambient Particles */}
      <div className={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <AmbientParticle
            key={`heart-${i}`}
            type="heart"
            index={i}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <AmbientParticle
            key={`dot-${i}`}
            type="dot"
            index={i}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <AmbientParticle
            key={`star-${i}`}
            type="star"
            index={i}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        {/* Hanging Images with Web Strings */}
        <AnimatePresence>
          {showImages && (
            <motion.div
              className={styles.hangingImagesContainer}
              style={{ y: webParallax }}
            >
              {hangingImages.map((img) => (
                <HangingImage key={img.id} {...img} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Text */}
        <motion.div
          className={styles.heroTextContainer}
          style={{ y: textY }}
          initial={{ y: 100, opacity: 0 }}
          animate={showImages ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
        >
          {/* Background Text (Comic Style) */}
          <motion.div
            className={styles.bgText}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={showImages ? { scale: 1, opacity: 0.1 } : {}}
            transition={{ delay: 3.5, duration: 1 }}
          >
            LOVE
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ x: -100, rotate: -5, opacity: 0 }}
            animate={showImages ? { x: 0, rotate: 0, opacity: 1 } : {}}
            transition={{
              delay: 3,
              type: 'spring',
              stiffness: 100,
              damping: 10,
            }}
          >
            {isEditor ? (
              <InlineEditor text={content.comicTexts?.[2] || 'Every hero has a story'} isEditor={isEditor} onSave={(v) => {
                const cur = content.comicTexts || [];
                cur[2] = v;
                updateContent({ comicTexts: cur });
              }} />
            ) : (
              content.comicTexts?.[2] || 'Every hero has a story'
            )}
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ x: 100, rotate: 3, opacity: 0 }}
            animate={showImages ? { x: 0, rotate: 0, opacity: 1 } : {}}
            transition={{
              delay: 3.3,
              type: 'spring',
              stiffness: 100,
              damping: 10,
            }}
          >
            {isEditor ? (
              <InlineEditor text={content.comicTexts?.[0] || 'And mine is written in your name'} isEditor={isEditor} onSave={(v) => {
                const cur = content.comicTexts || [];
                cur[0] = v;
                updateContent({ comicTexts: cur });
              }} />
            ) : (
              content.comicTexts?.[0] || 'And mine is written in your name'
            )}

          </motion.p>
        </motion.div>

        {/* Comic Stickers */}
        <ComicSticker
          text="POW!"
          color="#e63946"
          rotation={-15}
          delay={0.5}
          left="8%"
          top="65%"
        />
        <ComicSticker
          text="LOVE"
          color="#ffd700"
          rotation={10}
          delay={0.8}
          left="85%"
          top="25%"
        />
        <ComicSticker
          text="WOW"
          color="#457b9d"
          rotation={-8}
          delay={1.1}
          left="78%"
          top="70%"
        />

        {/* Floating Lucide Icons */}
        <FloatingIcon Icon={Heart} delay={0} left="5%" top="20%" color="#e63946" size={32} />
        <FloatingIcon Icon={Sparkles} delay={0.3} left="92%" top="40%" color="#ffd700" size={28} />
        <FloatingIcon Icon={Star} delay={0.6} left="10%" top="75%" color="#ffd700" size={24} />
        <FloatingIcon Icon={MessageCircle} delay={0.9} left="88%" top="80%" color="#ffb4b4" size={26} />
        <FloatingIcon Icon={Camera} delay={1.2} left="50%" top="15%" color="#fff" size={30} />
        <FloatingIcon Icon={Zap} delay={1.5} left="25%" top="85%" color="#ffd700" size={22} />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5, duration: 1 }}
      >
        <motion.div
          className={styles.scrollArrow}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
};

export default SpiderHero;