'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SpiderHero from '@/components/SpiderHero/SpiderHero';
import ComicLoveMessage from '@/components/ComicLoveMessage/ComicLoveMessage';
import Scene3Memories from '@/components/Scene3Memories/Scene3Memories';
import Scene4Reasons from '@/components/Scene4Reasons/Scene4Reasons';
import Scene5LoveMeter from '@/components/Scene5LoveMeter/Scene5LoveMeter';
import Scene6Final from '@/components/Scene6Final/Scene6Final';
import siteContent from '@/content/siteContent.json';
import styles from './page.module.css';

// Dynamic import for SpiderCursor to avoid SSR issues
const SpiderCursor = dynamic(
  () => import('@/components/SpiderCursor/SpiderCursor'),
  { ssr: false }
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className={styles.main}>
      {/* Custom Spider Cursor */}
      {isLoaded && <SpiderCursor />}

      {/* Scene 1: Spider Hero - Excitement & Curiosity */}
      <SpiderHero />

      {/* Scene 2: Comic Love Message */}
      <ComicLoveMessage
        recipientName={siteContent.letter.recipient}
        message={siteContent.letter.content}
      />

      {/* Scene 3: Memories - Attachment */}
      <Scene3Memories memories={siteContent.memories} />

      {/* Scene 4: Reasons I Love You - Fun & Personality */}
      <Scene4Reasons reasons={siteContent.reasons} />

      {/* Scene 5: Love Meter - Playful Emotion */}
      <Scene5LoveMeter />

      {/* Scene 6: Final Moment - Climax */}
      <Scene6Final finalMessage={siteContent.finalMessage} />
    </main>
  );
}
