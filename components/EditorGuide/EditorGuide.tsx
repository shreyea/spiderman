"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MousePointer, Image, Save, Share2 } from 'lucide-react';
import styles from './EditorGuide.module.css';

const EditorGuide: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const guides = [
        {
            icon: <MousePointer size={18} />,
            title: 'Edit Text',
            description: 'Click any text to edit it. Press Enter or click outside to save.',
        },
        {
            icon: <Image size={18} />,
            title: 'Change Photos',
            description: 'In Skate and Collage sections, click images or use the upload area below.',
        },
        {
            icon: <Save size={18} />,
            title: 'Save Changes',
            description: 'Press the Save button to store your edits locally.',
        },
        {
            icon: <Share2 size={18} />,
            title: 'Publish',
            description: 'After saving, share your unique love page link!',
        },
    ];

    return (
        <>
            {/* Floating Help Button */}
            <motion.button
                className={styles.helpButton}
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <HelpCircle size={22} />
                <span>How to Edit</span>
            </motion.button>

            {/* Guide Panel Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className={styles.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={18} />
                            </button>

                            <div className={styles.header}>
                                <HelpCircle size={24} />
                                <h3>Editor Guide</h3>
                            </div>

                            <div className={styles.content}>
                                {guides.map((guide, index) => (
                                    <motion.div
                                        key={index}
                                        className={styles.guideItem}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.1 }}
                                    >
                                        <div className={styles.iconWrapper}>
                                            {guide.icon}
                                        </div>
                                        <div className={styles.guideText}>
                                            <strong>{guide.title}</strong>
                                            <p>{guide.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className={styles.footer}>
                                <span>💕 Made with love</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default EditorGuide;
