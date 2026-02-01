'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene4Collage.module.css';
import { useContent } from '../../context/ContentContext';
import InlineEditor from '../InlineEditor/InlineEditor';

interface Photo {
  id: number;
  src: string;
  caption: string;
  rotation: number;
  useTapeAlt?: boolean;
}

const Scene4Collage: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { content, updateContent, isEditor } = useContent();

  const defaultPhotos: Photo[] = [
    { id: 1, src: '/images/s1.png', caption: 'Our First Day', rotation: -5 },
    { id: 2, src: '/images/s2.png', caption: 'Best Moment', rotation: 3, useTapeAlt: true },
    { id: 3, src: '/images/s3.png', caption: 'Together Forever', rotation: -2 },
    { id: 4, src: '/stickers/web1.png', caption: 'Connected', rotation: 4, useTapeAlt: true },
    { id: 5, src: '/stickers/web2.png', caption: 'Intertwined', rotation: -4 },
    { id: 6, src: '/images/bg.png', caption: 'Our World', rotation: 2, useTapeAlt: true },
  ];

  const photos: Photo[] = (content.scene4Collage?.images || defaultPhotos.map(p => p.src)).map((src, idx) => ({
    id: idx + 1,
    src,
    caption: content.scene4Collage?.captions?.[idx] || defaultPhotos[idx]?.caption || '',
    rotation: defaultPhotos[idx]?.rotation || 0,
    useTapeAlt: defaultPhotos[idx]?.useTapeAlt,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const photoVariants = {
    hidden: { y: -100, opacity: 0, rotate: -20 },
    visible: (photo: Photo) => ({
      y: 0,
      opacity: 1,
      rotate: photo.rotation,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
      },
    }),
  };

  const stickerVariants = {
    hidden: { scale: 0, rotate: -30 },
    visible: (rotation: number) => ({
      scale: 1,
      rotate: rotation,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 1.2,
      },
    }),
  };

  const webStringVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className={styles.collageSection} ref={ref}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <img src="/images/back2.png" alt="Background" />
      </div>

      {/* Background Textures */}
      <div className={styles.scrapbookTexture} />
      <div className={styles.grainOverlay} />

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Moments in My Web
        </motion.h2>

        {/* Collage Grid */}
        <motion.div
          className={styles.collageGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              className={styles.photoWrapper}
              variants={photoVariants}
              custom={photo}
            >
              {/* Web String */}
              <motion.div
                className={styles.webString}
                variants={webStringVariants}
              />

              {/* Photo Frame */}
              <motion.div
                className={styles.photoFrame}
                style={{ transform: `rotate(${photo.rotation}deg)` }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className={`${styles.tape} ${photo.useTapeAlt ? styles.tapeAlt : ''}`} />
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className={styles.photoImage}
                />
                <span className={styles.photoCaption}>
                  <InlineEditor
                    text={photo.caption}
                    isEditor={isEditor}
                    onSave={(v) => {
                      const curCaps = content.scene4Collage?.captions ? [...content.scene4Collage.captions] : photos.map(p => p.caption);
                      curCaps[idx] = v;
                      updateContent({ scene4Collage: { images: content.scene4Collage?.images || photos.map(p => p.src), captions: curCaps } });
                    }}
                  />
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stickers */}
      <div className={styles.stickersContainer}>
        <motion.div
          className={`${styles.sticker} ${styles.stickerLove}`}
          variants={stickerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={-12}
        >
          LOVE
        </motion.div>
        <motion.div
          className={`${styles.sticker} ${styles.stickerWow}`}
          variants={stickerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={8}
        >
          WOW
        </motion.div>
        <motion.div
          className={`${styles.sticker} ${styles.stickerForever}`}
          variants={stickerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={-5}
        >
          FOREVER
        </motion.div>
      </div>

      {/* Speech Bubbles */}
      <motion.div
        className={`${styles.speechBubble} ${styles.bubble1}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.5, type: 'spring' }}
      >
        <InlineEditor text={content.comicTexts?.[0] || 'So many memories!'} isEditor={isEditor} onSave={(v) => { const cur = content.comicTexts || []; cur[0] = v; updateContent({ comicTexts: cur }); }} />
      </motion.div>
      <motion.div
        className={`${styles.speechBubble} ${styles.bubble2}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.8, type: 'spring' }}
      >
        <InlineEditor text={content.comicTexts?.[1] || 'Each one special'} isEditor={isEditor} onSave={(v) => { const cur = content.comicTexts || []; cur[1] = v; updateContent({ comicTexts: cur }); }} />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.caption}
                className={styles.modalImage}
              />
              <button
                className={styles.modalClose}
                onClick={() => setSelectedPhoto(null)}
              >
                <X size={22} />
              </button>
              <motion.div
                className={styles.modalCaption}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {selectedPhoto.caption}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comic Stickers */}
      <motion.div
        className={styles.comicSticker}
        style={{
          top: '10%',
          left: '5%',
          backgroundColor: '#e63946',
          transform: 'rotate(-12deg)',
        }}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={-15}
        whileHover={{ scale: 1.1, rotate: '-17deg' }}
      >
        <span>MEMORIES</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          top: '20%',
          right: '8%',
          backgroundColor: '#ffd700',
          transform: 'rotate(8deg)',
        }}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={12}
        whileHover={{ scale: 1.1, rotate: '13deg' }}
      >
        <span>HEART</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '25%',
          left: '10%',
          backgroundColor: '#457b9d',
          transform: 'rotate(-6deg)',
        }}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={-10}
        whileHover={{ scale: 1.1, rotate: '-11deg' }}
      >
        <span>FOREVER</span>
      </motion.div>

      <motion.div
        className={styles.comicSticker}
        style={{
          bottom: '15%',
          right: '5%',
          backgroundColor: '#e63946',
          transform: 'rotate(14deg)',
        }}
        variants={stickerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        custom={18}
        whileHover={{ scale: 1.1, rotate: '19deg' }}
      >
        <span>LOVE</span>
      </motion.div>
      {/* Editor-only: Collage image upload controls below section */}
      {isEditor && (
        <div className={styles.uploadPanel}>
          <h3 className={styles.uploadTitle}>
            <Heart size={18} />
            Update Collage Gallery
          </h3>
          <div className={styles.uploadGrid}>
            {photos.map((p, idx) => (
              <div key={p.id} className={styles.uploadCard}>
                <span className={styles.uploadLabel}>Photo {idx + 1}</span>
                <div
                  className={styles.uploadPreview}
                  style={{ backgroundImage: `url(${p.src})` }}
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
                        const curImgs = content.scene4Collage?.images ? [...content.scene4Collage.images] : photos.map(pp => pp.src);
                        curImgs[idx] = url;
                        updateContent({ scene4Collage: { images: curImgs, captions: content.scene4Collage?.captions || photos.map(pp => pp.caption) } });
                      };
                      reader.readAsDataURL(f);
                    }}
                  />
                  <Star size={12} />
                  Upload
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Scene4Collage;