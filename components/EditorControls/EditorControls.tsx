'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Share2, LogOut, Check, Copy, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import styles from './EditorControls.module.css';

const EditorControls: React.FC = () => {
    const { isEditor, logout, saveProject, publishProject, getShareLink, project } = useAuth();
    const { content } = useContent();

    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);
    const [showShareLink, setShowShareLink] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isEditor) return null;

    const handleSave = async () => {
        setIsSaving(true);
        const success = await saveProject(content);
        setIsSaving(false);

        if (success) {
            setShowSuccess('Saved!');
            setTimeout(() => setShowSuccess(null), 2000);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        const success = await publishProject();
        setIsPublishing(false);

        if (success) {
            setShowShareLink(true);
        }
    };

    const handleCopyLink = () => {
        const link = getShareLink();
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {/* Editor Controls Panel */}
            <motion.div
                className={styles.controlsPanel}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
            >
                <div className={styles.panelHeader}>
                    <span className={styles.editBadge}>✏️ Edit Mode</span>
                </div>

                <div className={styles.buttons}>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Save size={18} />
                            </motion.div>
                        ) : (
                            <>
                                <Save size={18} />
                                Save
                            </>
                        )}
                    </button>

                    <button
                        className={styles.publishButton}
                        onClick={handlePublish}
                        disabled={isPublishing}
                    >
                        {isPublishing ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Share2 size={18} />
                            </motion.div>
                        ) : (
                            <>
                                <Share2 size={18} />
                                Publish
                            </>
                        )}
                    </button>

                    <button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {project?.is_published && (
                    <div className={styles.shareInfo}>
                        <small>🔗 Published</small>
                    </div>
                )}
            </motion.div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className={styles.toast}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                    >
                        <Check size={18} />
                        {showSuccess}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Link Modal */}
            <AnimatePresence>
                {showShareLink && (
                    <motion.div
                        className={styles.shareOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowShareLink(false)}
                    >
                        <motion.div
                            className={styles.shareModal}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className={styles.closeShare}
                                onClick={() => setShowShareLink(false)}
                            >
                                <X size={18} />
                            </button>

                            <h3 className={styles.shareTitle}>🎉 Published!</h3>
                            <p className={styles.shareSubtitle}>Share this link with your special someone:</p>

                            <div className={styles.linkBox}>
                                <input
                                    type="text"
                                    value={getShareLink()}
                                    readOnly
                                    className={styles.linkInput}
                                />
                                <button
                                    className={styles.copyButton}
                                    onClick={handleCopyLink}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>

                            {copied && (
                                <p className={styles.copiedText}>Copied to clipboard!</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EditorControls;
