'use client';

import React from 'react';
import {
    SpiderHero,
    Scene2Skate,
    Scene3Maze,
    Scene4Collage,
    Scene7FinalPanel,
    SceneLetter,
    LoginIcon,
} from '.';
import styles from '../app/page.module.css';

const HomePageContent: React.FC = () => {
    return (
        <main className={styles.main}>
            {/* Login Icon */}
            <LoginIcon />

            {/* Sections */}
            <SpiderHero />
            <Scene2Skate />
            <Scene3Maze />
            <Scene4Collage />
            <SceneLetter />
            <Scene7FinalPanel />
        </main>
    );
};

export default HomePageContent;
