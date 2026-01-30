'use client';

import React from 'react';
import {
  SpiderHero,
  Scene1Arrival,
  Scene2Skate,
  Scene3Maze,
  Scene4Collage,
  Scene5LoveMeter,
  Scene6Final,
  SceneLetter,
  SpiderCursor,
} from '../components';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Custom Spider Web Cursor */}
      <SpiderCursor />

      {/* Section 1: Hero - Hanging Memories in the Wind */}
      <SpiderHero />

      {/* Section 2: Skate Scene - Love on the Move */}
      <Scene2Skate />

      {/* Section 3: Web Maze Game - Find Your Way */}
      <Scene3Maze />

      {/* Section 4: Memory Collage Wall - Moments in My Web */}
      <Scene4Collage />

      {/* Section 5: Unique Letter Section */}
      <SceneLetter />

      {/* Section 6: Love Power Meter */}
      <Scene5LoveMeter />

      {/* Section 7: Final Confession - The Big Panel */}
      <Scene6Final />
    </main>
  );
}
