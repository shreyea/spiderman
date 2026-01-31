"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Stars, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './Scene7FinalPanel.module.css';
import { useContent } from '../../context/ContentContext';
import InlineEditor from '../InlineEditor/InlineEditor';
import ImageUploadCard from '../ImageUploadCard/ImageUploadCard';

const Scene7FinalPanel: React.FC = () => {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const { content, updateContent, isEditor } = useContent();
    const [celebrated, setCelebrated] = useState(false);
    const [showFloatingHearts, setShowFloatingHearts] = useState(false);

    // Default fallbacks
    const panels = content.finalPanel || {
        panel1: { text: 'Every day... I find myself thinking about you.', image: '' },
        panel2: { text: 'Some days, I miss you more than I can explain.', image: '' },
        panel3: { text: "And there's something I've been wanting to ask you...", image: '' },
        panel4: { text: 'Will you be my Valentine?', image: '', sticker: 'heart' }
    };

    // Floating stickers for decoration
    const decorativeStickers = [
        { src: '/stickers/heart.png', top: '5%', left: '5%', size: 80, delay: 0.2, rotate: -15 },
        { src: '/stickers/web1.png', top: '10%', right: '8%', size: 90, delay: 0.4, rotate: 10 },
        { src: '/stickers/spi.png', bottom: '15%', left: '3%', size: 75, delay: 0.6, rotate: -8 },
        { src: '/stickers/aesthetic_heart_sticker___Pink_Web_Heart_Sticker-removebg-preview.png', bottom: '10%', right: '5%', size: 70, delay: 0.8, rotate: 12 },
        { src: '/stickers/web2.png', top: '40%', left: '2%', size: 65, delay: 1.0, rotate: -5 },
        { src: '/stickers/spi2.png', top: '35%', right: '3%', size: 85, delay: 1.2, rotate: 8 },
    ];

    // Floating hearts for celebration
    const floatingHearts = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 30 + Math.random() * 40,
    }));

    const handleFinalClick = () => {
        if (celebrated) return;
        setCelebrated(true);
        setShowFloatingHearts(true);

        // Heart-shaped confetti burst
        const end = Date.now() + 4 * 1000;
        const colors = ['#e63946', '#ff6b6b', '#ff8fab', '#ffd700', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors,
                shapes: ['circle'],
                scalar: 1.2
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors,
                shapes: ['circle'],
                scalar: 1.2
            });
            // Center burst occasionally
            if (Math.random() > 0.7) {
                confetti({
                    particleCount: 10,
                    spread: 100,
                    origin: { x: 0.5, y: 0.5 },
                    colors: colors,
                    scalar: 1.5
                });
            }

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const updatePanel = (panelKey: keyof typeof panels, field: string, value: string) => {
        const newPanelData = { ...panels[panelKey], [field]: value };
        updateContent({
            finalPanel: {
                ...panels,
                [panelKey]: newPanelData
            }
        });
    };

    const panelVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.6, duration: 0.8, ease: 'easeOut' }
        })
    };

    return (
        <section className={styles.container} ref={ref}>
            {/* Background Image */}
            <div className={styles.backgroundImage}>
                <img src="/images/final.png" alt="Background" />
            </div>

            {/* Halftone/Comic texture overlay */}
            <div className={styles.textureOverlay} />
            <div className={styles.halftoneOverlay} />

            {/* Decorative floating stickers */}
            {decorativeStickers.map((sticker, i) => (
                <motion.img
                    key={i}
                    src={sticker.src}
                    alt="Sticker"
                    className={styles.floatingSticker}
                    style={{
                        top: sticker.top,
                        left: sticker.left,
                        right: sticker.right,
                        bottom: sticker.bottom,
                        width: sticker.size,
                    }}
                    initial={{ scale: 0, rotate: sticker.rotate }}
                    animate={inView ? {
                        scale: [1, 1.1, 1],
                        rotate: [sticker.rotate - 5, sticker.rotate + 5, sticker.rotate - 5],
                        y: [0, -8, 0],
                    } : {}}
                    transition={{
                        delay: sticker.delay,
                        type: 'spring',
                        stiffness: 150,
                        scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                />
            ))}

            {/* Floating hearts celebration */}
            <AnimatePresence>
                {showFloatingHearts && floatingHearts.map((heart) => (
                    <motion.img
                        key={heart.id}
                        src="/stickers/heart.png"
                        alt="Heart"
                        className={styles.celebrationHeart}
                        style={{ left: `${heart.left}%`, width: heart.size }}
                        initial={{ y: '100vh', opacity: 0, rotate: 0 }}
                        animate={{
                            y: '-100vh',
                            opacity: [0, 1, 1, 0],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: heart.duration,
                            delay: heart.delay,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </AnimatePresence>

            <motion.h2
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: -30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                The Final Panel
            </motion.h2>
            <motion.p
                className={styles.sectionSubtitle}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                The page where everything comes together...
            </motion.p>

            <div className={styles.comicGrid}>
                {/* Panel 1 */}
                <motion.div
                    className={styles.panel}
                    custom={0}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={panelVariants}
                >
                    <div className={styles.panelInner}>
                        {panels.panel1.image ? (
                            <div className={styles.panelImage} style={{ backgroundImage: `url(${panels.panel1.image})` }} />
                        ) : (
                            <div className={styles.panelPlaceholder}>
                                <Heart size={48} className={styles.placeholderIcon} />
                            </div>
                        )}
                        <div className={styles.captionBox}>
                            <InlineEditor
                                text={panels.panel1.text}
                                isEditor={isEditor}
                                multiline
                                onSave={(v) => updatePanel('panel1', 'text', v)}
                            />
                        </div>
                    </div>
                    {isEditor && (
                        <div className={styles.editControls}>
                            <ImageUploadCard
                                image={panels.panel1.image || ''}
                                onImageChange={(url) => updatePanel('panel1', 'image', url)}
                                label="Panel 1"
                            />
                        </div>
                    )}
                </motion.div>

                {/* Panel 2 */}
                <motion.div
                    className={styles.panel}
                    custom={1}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={panelVariants}
                >
                    <div className={styles.panelInner}>
                        {panels.panel2.image ? (
                            <div className={styles.panelImage} style={{ backgroundImage: `url(${panels.panel2.image})` }} />
                        ) : (
                            <div className={styles.panelPlaceholder}>
                                <Sparkles size={48} className={styles.placeholderIcon} />
                            </div>
                        )}
                        <div className={`${styles.captionBox} ${styles.captionBoxAlt}`}>
                            <InlineEditor
                                text={panels.panel2.text}
                                isEditor={isEditor}
                                multiline
                                onSave={(v) => updatePanel('panel2', 'text', v)}
                            />
                        </div>
                    </div>
                    {isEditor && (
                        <div className={styles.editControls}>
                            <ImageUploadCard
                                image={panels.panel2.image || ''}
                                onImageChange={(url) => updatePanel('panel2', 'image', url)}
                                label="Panel 2"
                            />
                        </div>
                    )}
                </motion.div>


                {/* Panel 4 - Final Big Panel */}
                <motion.div
                    className={`${styles.panel} ${styles.finalPanel} ${celebrated ? styles.celebrating : ''}`}
                    custom={3}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={panelVariants}
                    onClick={handleFinalClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={styles.finalBackground} style={{ backgroundImage: `url(${panels.panel4.image || '/images/hearts.png'})` }} />
                    <div className={styles.finalGlow} />

                    <div className={styles.finalContent}>
                        <motion.div
                            className={styles.finalQuestion}
                            animate={celebrated ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <InlineEditor
                                text={panels.panel4.text}
                                isEditor={isEditor}
                                multiline
                                onSave={(v) => updatePanel('panel4', 'text', v)}
                            />
                        </motion.div>

                        {/* Heart sticker using image */}
                        <motion.img
                            src="/stickers/heart.png"
                            alt="Heart"
                            className={styles.mainHeartSticker}
                            animate={celebrated ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, 10, -10, 0],
                            } : {
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {!celebrated && (
                            <motion.p
                                className={styles.clickHint}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                💕 Tap to answer 💕
                            </motion.p>
                        )}

                        {celebrated && (
                            <motion.div
                                className={styles.yesMessage}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                YES! FOREVER! 💕
                            </motion.div>
                        )}
                    </div>

                    {isEditor && (
                        <div className={styles.editControlsFinal}>
                            <ImageUploadCard
                                image={panels.panel4.image || ''}
                                onImageChange={(url) => updatePanel('panel4', 'image', url)}
                                label="Background"
                            />
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Comic style text stickers */}
            <motion.div
                className={`${styles.comicSticker} ${styles.stickerPow}`}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1, rotate: -12 } : {}}
                transition={{ delay: 2, type: 'spring' }}
            >
                LOVE!
            </motion.div>
            <motion.div
                className={`${styles.comicSticker} ${styles.stickerBam}`}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1, rotate: 8 } : {}}
                transition={{ delay: 2.3, type: 'spring' }}
            >
                FOREVER
            </motion.div>
            <motion.div
                className={`${styles.comicSticker} ${styles.stickerZap}`}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1, rotate: -5 } : {}}
                transition={{ delay: 2.6, type: 'spring' }}
            >
                XOXO
            </motion.div>
            <motion.div
                className={`${styles.comicSticker} ${styles.stickerWow}`}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1, rotate: 12 } : {}}
                transition={{ delay: 2.9, type: 'spring' }}
            >
                YOURS
            </motion.div>
        </section>
    );
};

export default Scene7FinalPanel;
