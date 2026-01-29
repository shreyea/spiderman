'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SpiderCursor.module.css';

interface CursorPosition {
  x: number;
  y: number;
}

interface WebShot {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const SpiderCursor: React.FC = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [webShots, setWebShots] = useState<WebShot[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      
      // Create web shot effect
      const newWebShot: WebShot = {
        id: Date.now(),
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX + (Math.random() - 0.5) * 200,
        endY: e.clientY - Math.random() * 150 - 50,
      };
      
      setWebShots((prev) => [...prev, newWebShot]);
      
      // Remove web shot after animation
      setTimeout(() => {
        setWebShots((prev) => prev.filter((w) => w.id !== newWebShot.id));
      }, 600);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Don't render on mobile/touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className={styles.cursor}
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className={styles.cursorDot} />
        <motion.div
          className={styles.cursorRing}
          animate={{
            scale: isClicking ? 1.5 : 1,
            opacity: isClicking ? 0.5 : 1,
          }}
        />
      </motion.div>

      {/* Cursor Trail */}
      <motion.div
        className={styles.cursorTrail}
        animate={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
        }}
        style={{ opacity: isVisible ? 0.5 : 0 }}
      />

      {/* Web Shot Effects */}
      <AnimatePresence>
        {webShots.map((web) => (
          <svg
            key={web.id}
            className={styles.webShot}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          >
            <motion.line
              x1={web.startX}
              y1={web.startY}
              x2={web.startX}
              y2={web.startY}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ x2: web.startX, y2: web.startY }}
              animate={{ x2: web.endX, y2: web.endY }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            <motion.circle
              cx={web.startX}
              cy={web.startY}
              r="3"
              fill="#e63946"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </svg>
        ))}
      </AnimatePresence>
    </>
  );
};

export default SpiderCursor;
