'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Star, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import styles from './Scene3Maze.module.css';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = ['💕', '💖', '💗', '💝', '🦋', '🌹'];

const Scene3Maze: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  // Initialize cards
  const initializeGame = useCallback(() => {
    const shuffled = [...CARD_PAIRS, ...CARD_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsPlaying(true);
    setHasWon(false);
    setCombo(0);
  }, []);

  // Handle card click
  const handleCardClick = useCallback((cardId: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found!
        setCombo(c => c + 1);
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 800);
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true } 
              : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match
        setCombo(0);
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isChecking]);

  // Check for win
  useEffect(() => {
    if (isPlaying && cards.length > 0 && cards.every(c => c.isMatched)) {
      setTimeout(() => setHasWon(true), 500);
    }
  }, [cards, isPlaying]);

  // Reset game
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setHasWon(false);
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setCombo(0);
  }, []);

  // Floating stickers for win
  const winStickers = [
    { src: '/stickers/web2.png', angle: 45, delay: 0.1 },
    { src: '/stickers/web1.png', angle: 135, delay: 0.2 },
    { src: '/stickers/spi2.png', angle: 225, delay: 0.3 },
    { src: '/stickers/aesthetic_heart_sticker___Pink_Web_Heart_Sticker-removebg-preview.png', angle: 315, delay: 0.4 },
  ];

  // Confetti hearts
  const confettiHearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 0.5,
    size: 14 + Math.random() * 14,
  }));

  // Get star rating based on moves
  const getStarRating = () => {
    if (moves <= 8) return 3;
    if (moves <= 12) return 2;
    return 1;
  };

  return (
    <section className={styles.mazeSection} ref={ref}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <img src="/images/back3.png" alt="Hearts Background" />
      </div>

      {/* Overlays */}
      <div className={styles.darkOverlay} />
      <div className={styles.comicHalftone} />
      <div className={styles.grainOverlay} />

      {/* Content */}
      <div className={styles.contentContainer}>
        <motion.h2
          className={styles.title}
          initial={{ y: -30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Memory of Love
        </motion.h2>

        {/* Game Stats */}
        {isPlaying && !hasWon && (
          <motion.div
            className={styles.gameStats}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={styles.statItem}>
              <Zap size={18} />
              <span>Moves: {moves}</span>
            </div>
            <div className={styles.statItem}>
              <Heart size={18} fill="var(--color-primary)" />
              <span>Pairs: {cards.filter(c => c.isMatched).length / 2} / 6</span>
            </div>
          </motion.div>
        )}

        {/* Combo Indicator */}
        <AnimatePresence>
          {showCombo && combo > 1 && (
            <motion.div
              className={styles.comboIndicator}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Sparkles size={20} />
              {combo}x Combo!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Container */}
        <motion.div
          className={styles.gameContainer}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Card Grid */}
          {isPlaying && !hasWon && (
            <div className={styles.cardGrid}>
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`${styles.card} ${card.isFlipped || card.isMatched ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                  whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                  initial={{ rotateY: 0 }}
                  animate={{ 
                    rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                    scale: card.isMatched ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.cardFront}>
                      <Heart size={24} />
                    </div>
                    <div className={styles.cardBack}>
                      <span className={styles.cardEmoji}>{card.emoji}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Start Overlay */}
          {!isPlaying && !hasWon && (
            <motion.div className={styles.startOverlay}>
              <div className={styles.startContent}>
                <motion.div 
                  className={styles.startIcon}
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart size={48} fill="var(--color-primary)" />
                </motion.div>
                <p className={styles.startDescription}>
                  Match the pairs to unlock a special message!
                </p>
                <button className={styles.startButton} onClick={initializeGame}>
                  <Sparkles size={22} />
                  Start Game
                </button>
              </div>
            </motion.div>
          )}

          {/* Victory Overlay */}
          <AnimatePresence>
            {hasWon && (
              <motion.div
                className={styles.victoryOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Confetti Hearts */}
                {confettiHearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    className={styles.confettiHeart}
                    style={{ left: `${heart.left}%` }}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '-100%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.5, delay: heart.delay }}
                  >
                    <Heart size={heart.size} fill="var(--color-primary)" />
                  </motion.div>
                ))}

                {/* Flying Stickers */}
                {winStickers.map((sticker, i) => (
                  <motion.img
                    key={i}
                    src={sticker.src}
                    alt="Sticker"
                    className={styles.flyingSticker}
                    initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                    animate={{
                      scale: 1,
                      x: Math.cos(sticker.angle * Math.PI / 180) * 120,
                      y: Math.sin(sticker.angle * Math.PI / 180) * 120,
                      rotate: 360,
                    }}
                    transition={{ delay: sticker.delay, duration: 0.8, type: 'spring' }}
                  />
                ))}

                {/* Victory Content */}
                <motion.div
                  className={styles.victoryContent}
                  initial={{ scale: 0, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  {/* Star Rating */}
                  <div className={styles.starRating}>
                    {[1, 2, 3].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + star * 0.15, type: 'spring' }}
                      >
                        <Star 
                          size={32} 
                          fill={star <= getStarRating() ? '#ffd700' : 'transparent'}
                          color={star <= getStarRating() ? '#ffd700' : 'rgba(255,255,255,0.3)'}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className={styles.victoryMessage}>
                    Our love is unforgettable, just like you! 💕
                  </div>
                  
                  <div className={styles.victoryStats}>
                    Completed in {moves} moves
                  </div>
                  
                  <motion.button
                    className={styles.playAgainButton}
                    onClick={resetGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={18} />
                    Play Again
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        {isPlaying && !hasWon && (
          <motion.div
            className={styles.controlHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Tap cards to flip and find matching pairs!
          </motion.div>
        )}
      </div>

      {/* Corner Stickers with bouncy/windy animations */}
      <motion.img
        src="/stickers/wh2.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '12%', left: '15%' }}
        initial={{ scale: 0, rotate: -15 }}
        animate={inView ? {
          scale: 1,
          rotate: [-8, -3, -8],
          y: [0, -8, 0],
        } : {}}
        transition={{
          delay: 0.8,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/wh.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ top: '28%', right: '15%' }}
        initial={{ scale: 0, rotate: 15 }}
        animate={inView ? {
          scale: 1,
          rotate: [8, 12, 8],
          y: [0, 6, 0],
        } : {}}
        transition={{
          delay: 1,
          type: 'spring',
          stiffness: 150,
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/wh3.png"
        alt="Sticker"
        className={styles.stickerImage}
        style={{ bottom: '15%', right: '5%' }}
        initial={{ scale: 0, rotate: -10 }}
        animate={inView ? {
          scale: [1, 1.08, 1],
          rotate: [5, 10, 5],
        } : {}}
        transition={{
          delay: 1.2,
          type: 'spring',
          stiffness: 150,
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.img
        src="/stickers/wh4.png"
        alt="Heart Sticker"
        className={styles.stickerImage}
        style={{ bottom: '18%', left: '14%', width: '75px' }}
        initial={{ scale: 0, rotate: 10 }}
        animate={inView ? {
          scale: [1, 1.12, 1],
          rotate: [-5, 0, -5],
          y: [0, -10, 0],
        } : {}}
        transition={{
          delay: 1.4,
          type: 'spring',
          stiffness: 130,
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Corner Text Stickers */}
      <motion.div
        className={`${styles.textSticker} ${styles.stickerLove}`}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.6, type: 'spring' }}
      >
        LOVE
      </motion.div>
      <motion.div
        className={`${styles.textSticker} ${styles.stickerForever}`}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 1.8, type: 'spring' }}
      >
        FOREVER
      </motion.div>
    </section>
  );
};

export default Scene3Maze;
