"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Lock, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./login.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async () => {
        setIsLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            // Redirect to home page where edit mode will be enabled
            window.location.href = "/";
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    // Floating stickers decoration
    const stickers = [
        { src: '/stickers/heart.png', top: '10%', left: '5%', size: 60, delay: 0.2 },
        { src: '/stickers/web1.png', top: '15%', right: '8%', size: 70, delay: 0.4 },
        { src: '/stickers/spi.png', bottom: '20%', left: '8%', size: 55, delay: 0.6 },
        { src: '/stickers/spi2.png', bottom: '15%', right: '5%', size: 65, delay: 0.8 },
    ];

    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.backgroundImage}>
                <img src="/images/back1.png" alt="Background" />
            </div>
            <div className={styles.overlay} />
            <div className={styles.halftoneOverlay} />

            {/* Floating Stickers */}
            {stickers.map((sticker, i) => (
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
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: 1,
                        rotate: [0, 5, -5, 0],
                        y: [0, -10, 0],
                    }}
                    transition={{
                        delay: sticker.delay,
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Login Card */}
            <motion.div
                className={styles.loginCard}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
                {/* Decorative top */}
                <div className={styles.cardTop}>
                    <motion.div
                        className={styles.heartIcon}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Heart size={32} fill="#e63946" />
                    </motion.div>
                </div>

                {/* Title */}
                <motion.h1
                    className={styles.title}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Welcome Back, Hero
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Every love story needs its author...
                </motion.p>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className={styles.errorMessage}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <div className={styles.form}>
                    <motion.div
                        className={styles.inputGroup}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className={styles.inputIcon}>
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="Your secret identity (email)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className={styles.input}
                        />
                    </motion.div>

                    <motion.div
                        className={styles.inputGroup}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className={styles.inputIcon}>
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            placeholder="Your secret code"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className={styles.input}
                        />
                    </motion.div>

                    <motion.button
                        className={styles.loginButton}
                        onClick={login}
                        disabled={isLoading}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles size={20} />
                            </motion.div>
                        ) : (
                            <>
                                Enter the Story
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Footer */}
                <motion.p
                    className={styles.footer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    With great love comes great memories 💕
                </motion.p>
            </motion.div>

            {/* Comic stickers */}
            <motion.div
                className={`${styles.comicSticker} ${styles.stickerTop}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: 1, type: 'spring' }}
            >
                LOVE!
            </motion.div>
            <motion.div
                className={`${styles.comicSticker} ${styles.stickerBottom}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 8 }}
                transition={{ delay: 1.2, type: 'spring' }}
            >
                HERO
            </motion.div>
        </div>
    );
}
