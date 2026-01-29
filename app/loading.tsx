'use client';

import { motion } from 'framer-motion';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <motion.div 
        className={styles.heartLoader}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ❤️
      </motion.div>
      <motion.p 
        className={styles.loadingText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading your love story...
      </motion.p>
    </div>
  );
}
