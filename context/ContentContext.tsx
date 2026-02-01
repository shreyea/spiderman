'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ContentData {
    skate: {
        image1: string;
        image2: string;
        text: string;
    };
    memories: {
        image: string;
        caption: string;
    }[];
    comicTexts: string[];
    scene2Skate?: {
        images: string[];
    };
    scene4Collage?: {
        images: string[];
        captions?: string[];
    };
    letterText?: string;
    letterTitle?: string;
    celebrationMessage?: string;
    finalPanel?: {
        panel1: { text: string; image?: string };
        panel2: { text: string; image?: string };
        panel3: { text: string; image?: string };
        panel4: { text: string; image?: string; sticker?: string };
    };
}

const defaultContent: ContentData = {
    skate: {
        image1: '/images/s1.png',
        image2: '/images/s2.png',
        text: 'Every superhero has a story. This one is ours.',
    },
    memories: [
        { image: '/images/s1.png', caption: 'The day we met' },
        { image: '/images/s2.png', caption: 'Our first adventure' },
        { image: '/images/s3.png', caption: 'Forever tangled together' },
    ],
    comicTexts: [
        'You caught me in your web...',
        'And I never wanted to escape.',
        'Every superhero has a story.',
        'This one is ours.'
    ],
    scene2Skate: {
        images: ['/images/s1.png', '/images/s2.png', '/images/s3.png']
    },
    scene4Collage: {
        images: ['/images/s1.png', '/images/s2.png', '/images/s3.png', '/images/web1.png', '/images/web2.png', '/images/bg.png'],
        captions: ['The day we met', 'Our first adventure', 'Forever tangled', 'Connected by fate', 'Two hearts, one web', 'Our universe']
    },
    letterText: `Dear Love,

Even heroes fall in love...
and somehow, you became my favorite story.

Every moment with you feels like
a page from a comic I never want to end.

You are my greatest adventure,
my sweetest chapter,
and my happiest ending.

Forever yours,
Your Spider ❤️`,
    finalPanel: {
        panel1: { text: 'Every day, I find myself thinking about you...', image: '/images/s1.png' },
        panel2: { text: 'You make even the ordinary feel extraordinary.', image: '/images/s2.png' },
        panel3: { text: "There's something I've been meaning to ask...", image: '/images/s3.png' },
        panel4: { text: 'Be my forever person?', image: '/images/bg.png', sticker: 'heart' }
    }
};

interface ContentContextType {
    content: ContentData;
    updateContent: (newContent: Partial<ContentData>) => void;
    saveContent: () => void;
    isEditor: boolean;
    editDraft?: ContentData;
    setEditDraft?: (d: ContentData) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode; initialContent?: ContentData; isEditor?: boolean }> = ({
    children,
    initialContent,
    isEditor = false
}) => {
    const [content, setContent] = useState<ContentData>(defaultContent);
    const [editDraft, setEditDraft] = useState<ContentData>(defaultContent);
    const initialized = React.useRef(false);

    useEffect(() => {
        // Always update if initialContent is provided (e.g. loaded from Supabase after auth)
        if (initialContent) {
            console.log('CONTENT: Loading from Supabase project data');
            const merged = { ...defaultContent, ...initialContent } as ContentData;
            setContent(merged);
            setEditDraft(merged);
            initialized.current = true;
            return;
        }

        if (initialized.current) return;

        // Load from local storage only if no initialContent and not initialized
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('spiderman_content');
            if (saved) {
                try {
                    console.log('CONTENT: Loading from localStorage');
                    const parsed = JSON.parse(saved);
                    const merged = { ...defaultContent, ...parsed } as ContentData;
                    setContent(merged);
                    setEditDraft(merged);
                } catch (e) {
                    console.error('Failed to parse saved content');
                    setContent(defaultContent);
                    setEditDraft(defaultContent);
                }
            } else {
                console.log('CONTENT: Using default content');
                setContent(defaultContent);
                setEditDraft(defaultContent);
            }
        }
        initialized.current = true;
    }, [initialContent]);

    const updateContent = (newContent: Partial<ContentData>) => {
        if (isEditor) {
            setEditDraft(prev => ({ ...prev, ...newContent }));
        } else {
            setContent(prev => ({ ...prev, ...newContent }));
        }
    };

    const saveContent = () => {
        if (typeof window !== 'undefined') {
            // If in editor mode, persist the draft as the published content
            const toSave = isEditor ? editDraft : content;
            setContent(toSave);
            localStorage.setItem('spiderman_content', JSON.stringify(toSave));
        }
    };

    return (
        <ContentContext.Provider value={{ content: isEditor ? editDraft : content, updateContent, saveContent, isEditor, editDraft, setEditDraft }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
