'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Heart, ArrowRight, Sparkles, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal: React.FC = () => {
    const {
        showLoginModal,
        setShowLoginModal,
        login,
        loginError,
    } = useAuth();

    const [email, setEmail] = useState('');
    const [templateCode, setTemplateCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await login(email, templateCode);
        setIsLoading(false);
    };

    const handleClose = () => {
        setShowLoginModal(false);
    };

    // Login Modal
    if (showLoginModal) {
        return (
            <AnimatePresence>
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className={styles.modal}
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeButton} onClick={handleClose}>
                            <X size={20} />
                        </button>

                        <div className={styles.header}>
                            <motion.div
                                className={styles.heartIcon}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Heart size={28} fill="#e63946" />
                            </motion.div>
                            <h2 className={styles.title}>Welcome Back</h2>
                            <p className={styles.subtitle}>Login to edit your story</p>
                        </div>

                        {loginError && (
                            <div className={styles.error}>{loginError}</div>
                        )}

                        <form onSubmit={handleLogin} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <Key size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    placeholder="Template Code"
                                    value={templateCode}
                                    onChange={(e) => setTemplateCode(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Sparkles size={18} className={styles.spinning} />
                                ) : (
                                    <>
                                        Login <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return null;
};

export default LoginModal;

