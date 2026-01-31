'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SpiderCursor.module.css';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
}

interface ClickSplash {
  id: number;
  x: number;
  y: number;
}

const SpiderCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [clickSplashes, setClickSplashes] = useState<ClickSplash[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const trailIdRef = useRef(0);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    setPosition({ x: clientX, y: clientY });
    setIsVisible(true);

    // Calculate trail segment
    const dx = clientX - lastPosition.current.x;
    const dy = clientY - lastPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 15) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const newTrailPoint: TrailPoint = {
        id: trailIdRef.current++,
        x: lastPosition.current.x,
        y: lastPosition.current.y,
        angle,
        length: Math.min(distance, 40),
      };

      setTrail((prev) => [...prev.slice(-8), newTrailPoint]);
      lastPosition.current = { x: clientX, y: clientY };
    }
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);

    // Add click splash
    const splash: ClickSplash = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setClickSplashes((prev) => [...prev, splash]);

    // Remove splash after animation
    setTimeout(() => {
      setClickSplashes((prev) => prev.filter((s) => s.id !== splash.id));
    }, 500);
  }, []);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  // Handle hover detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.getAttribute('role') === 'button' ||
      target.style.cursor === 'pointer' ||
      window.getComputedStyle(target).cursor === 'pointer';

    setIsHovering(!!isInteractive);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseLeave]);

  // Clean up old trail segments
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(-6));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.cursorContainer} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>
      {/* Silk Trail */}
      <div className={styles.silkTrail}>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className={styles.trailSegment}
            style={{
              left: point.x,
              top: point.y,
              width: point.length,
              transform: `rotate(${point.angle}deg)`,
            }}
            initial={{ opacity: 0.6, scaleX: 1 }}
            animate={{ opacity: 0, scaleX: 0.5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Main Cursor */}
      <motion.div
        className={`${styles.cursor} ${isHovering ? styles.hovering : ''} ${isClicking ? styles.clicking : ''}`}
        style={{
          left: position.x,
          top: position.y,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div className={styles.webCursor}>
          {/* Web Pattern SVG */}
          <svg className={styles.webCursorSvg} viewBox="0 0 24 24">
            {/* Radial lines */}
            <line x1="12" y1="2" x2="12" y2="22" className={styles.webCursorPath} />
            <line x1="2" y1="12" x2="22" y2="12" className={styles.webCursorPath} />
            <line x1="4" y1="4" x2="20" y2="20" className={styles.webCursorPath} />
            <line x1="20" y1="4" x2="4" y2="20" className={styles.webCursorPath} />
            {/* Concentric circles */}
            <circle cx="12" cy="12" r="4" className={styles.webCursorPath} />
            <circle cx="12" cy="12" r="8" className={styles.webCursorPath} />
          </svg>
          {/* Center dot */}
          <motion.div
            className={styles.cursorDot}
            animate={{
              scale: isHovering ? 1.5 : 1,
              backgroundColor: isHovering ? '#ffd700' : '#e63946',
            }}
          />
        </div>
      </motion.div>

      {/* Click Splashes */}
      <AnimatePresence>
        {clickSplashes.map((splash) => (
          <motion.div
            key={splash.id}
            className={styles.clickSplash}
            style={{ left: splash.x, top: splash.y }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Expanding ring */}
            <motion.div
              className={styles.splashRing}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            {/* Web burst */}
            <motion.svg
              className={styles.splashWeb}
              viewBox="0 0 60 60"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * 360;
                const x2 = 30 + Math.cos(angle * Math.PI / 180) * 25;
                const y2 = 30 + Math.sin(angle * Math.PI / 180) * 25;
                return (
                  <line
                    key={i}
                    x1="30"
                    y1="30"
                    x2={x2}
                    y2={y2}
                    className={styles.splashWebPath}
                  />
                );
              })}
            </motion.svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SpiderCursor;
