'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginIcon.module.css';

const LoginIcon: React.FC = () => {
    const { isEditor, setShowLoginModal } = useAuth();

    // Don't show login icon if already in editor mode
    if (isEditor) return null;

    const handleClick = () => {
        setShowLoginModal(true);
    };

    return (
        <motion.button
            className={styles.loginButton}
            onClick={handleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Login to edit"
        >
            <div className={styles.iconWrapper}>
                <LogIn size={20} />
            </div>
            <Heart size={12} className={styles.heartDecor} fill="#e63946" />
        </motion.button>
    );
};

export default LoginIcon;
