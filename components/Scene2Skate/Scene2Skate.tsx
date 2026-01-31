'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, RotateCcw } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import styles from './Scene2Skate.module.css';
import { useContent } from '../../context/ContentContext';
import InlineEditor from '../InlineEditor/InlineEditor';

const Scene2Skate: React.FC = () => {
  const { content, updateContent, isEditor } = useContent();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const skateRef = useRef<HTMLDivElement>(null);

  const [animationPhase, setAnimationPhase] = useState<'idle' | 'moving' | 'reveal1' | 'reveal2' | 'reveal3' | 'complete'>('idle');
  const [currentText, setCurrentText] = useState('');
  const [revealedImages, setRevealedImages] = useState<number[]>([]);

  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Comic images - all on SAME horizontal line
  const comicImages = [
    { src: (content.scene2Skate?.images && content.scene2Skate.images[0]) || content.skate.image1, label: 'LOVE' },
    { src: (content.scene2Skate?.images && content.scene2Skate.images[1]) || content.skate.image2, label: 'WOW' },
    { src: (content.scene2Skate?.images && content.scene2Skate.images[2]) || '/images/s3.png', label: 'MINE' },
  ];


  const texts = [
    "Every journey begins with one moment.",
    "And that moment becomes a memory.",
    content.skate.text || "And that memory stays with me."
  ];

  // Start the animation
  const startAnimation = useCallback(() => {
    if (animationPhase !== 'idle') return;

    setAnimationPhase('moving');
    setRevealedImages([]);
    setCurrentText('');

    if (skateRef.current) {
      gsap.set(skateRef.current, { left: '5%' });

      animationRef.current = gsap.to(skateRef.current, {
        left: '85%',
        duration: 7,
        ease: 'power1.inOut',
        onUpdate: function () {
          const progress = this.progress();

          if (progress >= 0.30 && !revealedImages.includes(0)) {
            setRevealedImages(prev => [...prev, 0]);
            setCurrentText(texts[0]);
            setAnimationPhase('reveal1');
          }
          if (progress >= 0.55 && !revealedImages.includes(1)) {
            setRevealedImages(prev => [...prev, 1]);
            setCurrentText(texts[1]);
            setAnimationPhase('reveal2');
          }
          if (progress >= 0.80 && !revealedImages.includes(2)) {
            setRevealedImages(prev => [...prev, 2]);
            setCurrentText(texts[2]);
            setAnimationPhase('reveal3');
          }
        },
        onComplete: () => {
          setAnimationPhase('complete');
        }
      });
    }
  }, [animationPhase, revealedImages]);

  // Reset animation
  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }
    setAnimationPhase('idle');
    setRevealedImages([]);
    setCurrentText('');

    if (skateRef.current) {
      gsap.set(skateRef.current, { left: '5%' });
    }
  }, []);

  // Speed lines
  const speedLines = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: 40 + Math.random() * 20,
    width: 60 + Math.random() * 100,
  }));

  // Web trail
  const webTrailSegments = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    offset: i * 8,
  }));

  return (
    <section
      className={styles.skateSection}
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        inViewRef(node);
      }}
    >
      {/* Background Image - back.jpg */}
      <div className={styles.backgroundImage}>
        <img src="/images/back.jpg" alt="Background" />
      </div>

      {/* Overlays */}
      <div className={styles.darkOverlay} />
      <div className={styles.comicHalftone} />



      {/* Speed Lines */}
      {(animationPhase === 'moving' || animationPhase.startsWith('reveal')) && (
        <div className={styles.speedLinesContainer}>
          {speedLines.map((line) => (
            <motion.div
              key={line.id}
              className={styles.speedLine}
              style={{ top: `${line.top}%`, width: line.width }}
              animate={{
                opacity: [0, 0.5, 0],
                x: [-150, 80],
              }}
              transition={{
                duration: 0.7,
                delay: line.id * 0.1,
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Content Container - everything on SAME horizontal line */}
      <div className={styles.contentContainer}>
        {/* Title */}
        <motion.div
          className={styles.titleArea}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.title}>
            <InlineEditor
              text={content.scene2Skate?.images ? 'Love on the Move' : 'Love on the Move'}
              isEditor={isEditor}
              onSave={(v) => {
                // Title isn't stored separately in current ContentData; skipping persistence for title for now
              }}
            />
          </h2>
        </motion.div>

        {/* Comic Text Display */}
        <div className={styles.textBubbleArea}>
          <AnimatePresence mode="wait">
            {currentText && (
              <motion.div
                key={currentText}
                className={styles.comicTextBubble}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {currentText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HORIZONTAL ROW - Images and Skate on SAME Y-axis */}
        <div className={styles.horizontalTrack}>
          {/* Three Image Positions - Fixed positions */}
          <div className={styles.imagePositions}>
            {comicImages.map((img, index) => (
              <motion.div
                key={index}
                className={styles.comicPanel}
                initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
                animate={revealedImages.includes(index) ? {
                  scale: 1,
                  opacity: 1,
                  rotate: index === 0 ? -4 : index === 1 ? 2 : -3,
                } : {}}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                }}
              >
                <img src={img.src} alt={`Memory ${index + 1}`} className={styles.panelImage} />
                <div className={styles.panelOverlay} />

                {/* Sticker label */}
                <motion.div
                  className={styles.panelLabel}
                  style={{
                    backgroundColor: index === 0 ? '#e63946' : index === 1 ? '#ffd700' : '#457b9d',
                    color: index === 1 ? '#0a0a1a' : '#fff',
                  }}
                  initial={{ scale: 0 }}
                  animate={revealedImages.includes(index) ? { scale: 1 } : {}}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
                >
                  {img.label}
                </motion.div>

                {/* Burst effect */}
                {revealedImages.includes(index) && (
                  <motion.div
                    className={styles.burstEffect}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Skate - moves on same horizontal line */}
          <div
            ref={skateRef}
            className={styles.skateContainer}
          >
            {/* Web Trail */}
            {(animationPhase === 'moving' || animationPhase.startsWith('reveal')) && (
              <div className={styles.webTrail}>
                {webTrailSegments.map((seg) => (
                  <motion.div
                    key={seg.id}
                    className={styles.webTrailSegment}
                    style={{ left: `-${seg.offset * 6}px` }}
                    animate={{ opacity: [0.6, 0.2, 0], scaleX: [1, 0.5, 0] }}
                    transition={{ duration: 0.5, delay: seg.id * 0.03, repeat: Infinity }}
                  />
                ))}
              </div>
            )}

            <motion.img
              src="/images/skate.png"
              alt="Skateboard"
              className={styles.skateImage}
              animate={animationPhase !== 'idle' && animationPhase !== 'complete' ? {
                rotate: [0, -2, 2, 0],
              } : {}}
              transition={{ duration: 0.3, repeat: Infinity }}
            />

            {/* Sparkle */}
            {animationPhase !== 'idle' && animationPhase !== 'complete' && (
              <motion.div
                className={styles.skateSparkle}
                animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Sparkles size={16} />
              </motion.div>
            )}
          </div>

          {/* Start Button */}
          {animationPhase === 'idle' && (
            <motion.div
              className={styles.startOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button className={styles.startButton} onClick={startAnimation}>
                <Heart size={20} fill="white" />
                Start the Journey
              </button>
            </motion.div>
          )}
        </div>

        {/* Experience Again Button */}
        {animationPhase === 'complete' && (
          <motion.div
            className={styles.restartContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <motion.button
              className={styles.experienceAgainButton}
              onClick={resetAnimation}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={18} />
              Experience Again
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Editor-only: Skate Image Upload Controls (placed below section) */}
      {isEditor && (
        <div className={styles.uploadPanel}>
          <h3 className={styles.uploadTitle}>
            <Sparkles size={18} />
            Update Skate Memories
          </h3>
          <div className={styles.uploadGrid}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.uploadCard}>
                <span className={styles.uploadLabel}>Memory {i + 1}</span>
                <div
                  className={styles.uploadPreview}
                  style={{ backgroundImage: `url(${comicImages[i].src})` }}
                />
                <label className={styles.uploadButton}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={styles.uploadInput}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 2 * 1024 * 1024) {
                        console.warn('File must be under 2MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const url = ev.target?.result as string;
                        const cur = content.scene2Skate?.images ? [...content.scene2Skate.images] : [content.skate.image1, content.skate.image2];
                        cur[i] = url;
                        updateContent({ scene2Skate: { images: cur } });
                      };
                      reader.readAsDataURL(f);
                    }}
                  />
                  <Heart size={14} />
                  Upload Photo
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corner Stickers */}
      <motion.img
        src="/stickers/spi.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '7%', left: '25%' }}
        initial={{ scale: 5, rotate: -20 }}
        animate={inView ? {
          scale: 1,
          rotate: [-8, -5, -8],
        } : {}}
        transition={{
          delay: 0.5,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/sleep.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '7%', right: '25%' }}
        initial={{ scale: 0, rotate: 15 }}
        animate={inView ? {
          scale: 1,
          rotate: [8, 12, 8],
        } : {}}
        transition={{
          delay: 0.7,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/spi2.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ bottom: '5%', left: '5%' }}
        initial={{ scale: 0, rotate: -10 }}
        animate={inView ? {
          scale: [1, 1.05, 1],
          rotate: [5, 8, 5],
        } : {}}
        transition={{
          delay: 0.9,
          type: 'spring',
          stiffness: 150,
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/aesthetic_heart_sticker___Pink_Web_Heart_Sticker-removebg-preview.png"
        alt="Heart Sticker"
        className={styles.stickerImage}
        style={{ bottom: '5%', right: '5%', width: '70px' }}
        initial={{ scale: 0, rotate: 10 }}
        animate={inView ? {
          scale: [1, 1.1, 1],
          rotate: [-5, 0, -5],
        } : {}}
        transition={{
          delay: 1.1,
          type: 'spring',
          stiffness: 150,
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </section>
  );
};

export default Scene2Skate;
