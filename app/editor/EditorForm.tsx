'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useContent, ContentData } from '../../context/ContentContext';
import styles from './editor.module.css';

export default function EditorForm() {
    const { content, updateContent, saveContent } = useContent();
    // CRITICAL: Use separate editData state that is NOT reinitialized on every render
    const [editData, setEditData] = useState<ContentData>(content);
    const isInitialized = useRef(false);

    // Initialize editData ONLY ONCE on mount
    useEffect(() => {
        if (!isInitialized.current) {
            setEditData(content);
            isInitialized.current = true;
        }
    }, [content]);

    // Debounced sync to context for live preview
    useEffect(() => {
        const timer = setTimeout(() => {
            updateContent(editData);
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData]);

    // Handle image uploads
    const handleImageUpload = (
        section: 'skate' | 'memories',
        key: string,
        file: File | null,
        index?: number
    ) => {
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be under 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;

            setEditData(prev => {
                if (section === 'skate') {
                    return {
                        ...prev,
                        skate: { ...prev.skate, [key]: result }
                    };
                } else if (section === 'memories' && typeof index === 'number') {
                    const newMemories = [...prev.memories];
                    newMemories[index] = { ...newMemories[index], image: result };
                    return { ...prev, memories: newMemories };
                }
                return prev;
            });
        };
        reader.readAsDataURL(file);
    };

    // Handle text changes - CRITICAL: Use functional setState to avoid closure issues
    const handleTextChange = (
        path: 'skate.text' | `memories.${number}.caption` | `comicTexts.${number}`,
        value: string
    ) => {
        setEditData(prev => {
            if (path === 'skate.text') {
                return {
                    ...prev,
                    skate: { ...prev.skate, text: value }
                };
            } else if (path.startsWith('memories.')) {
                const index = parseInt(path.split('.')[1]);
                const newMemories = [...prev.memories];
                newMemories[index] = { ...newMemories[index], caption: value };
                return { ...prev, memories: newMemories };
            } else if (path.startsWith('comicTexts.')) {
                const index = parseInt(path.split('.')[1]);
                const newTexts = [...prev.comicTexts];
                newTexts[index] = value;
                return { ...prev, comicTexts: newTexts };
            }
            return prev;
        });
    };

    return (
        <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
                <h1 className={styles.panelTitle}>✨ Customize Your Page</h1>
                <p className={styles.panelSubtitle}>
                    Live preview • Changes save automatically
                </p>
            </div>

            <div className={styles.panelContent}>

                {/* SKATE SECTION */}
                <section className={styles.sectionGroup}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNumber}>1</span>
                        Skate Scene
                    </h2>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>First Image</label>
                        <div className={styles.fileInputWrapper}>
                            {editData.skate.image1 && (
                                <div 
                                    className={styles.imagePreview}
                                    style={{ backgroundImage: `url(${editData.skate.image1})` }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={(e) => handleImageUpload('skate', 'image1', e.target.files?.[0] || null)}
                            />
                            <div className={styles.fileInputLabel}>
                                📸 {editData.skate.image1 ? 'Change Image' : 'Upload Image'}
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Second Image</label>
                        <div className={styles.fileInputWrapper}>
                            {editData.skate.image2 && (
                                <div 
                                    className={styles.imagePreview}
                                    style={{ backgroundImage: `url(${editData.skate.image2})` }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={(e) => handleImageUpload('skate', 'image2', e.target.files?.[0] || null)}
                            />
                            <div className={styles.fileInputLabel}>
                                📸 {editData.skate.image2 ? 'Change Image' : 'Upload Image'}
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Journey Caption</label>
                        <input
                            type="text"
                            className={styles.textInput}
                            value={editData.skate.text}
                            onChange={(e) => handleTextChange('skate.text', e.target.value)}
                            placeholder="e.g., Every journey begins with one moment..."
                        />
                    </div>
                </section>

                {/* MEMORIES SECTION */}
                <section className={styles.sectionGroup}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNumber}>2</span>
                        Memory Gallery
                    </h2>

                    {editData.memories.slice(0, 3).map((mem, i) => (
                        <div key={`memory-${i}`} className={styles.memoryCard}>
                            <div className={styles.memoryHeader}>
                                <span className={styles.memoryLabel}>Memory {i + 1}</span>
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.fileInputWrapper}>
                                    {mem.image && (
                                        <div 
                                            className={styles.imagePreview}
                                            style={{ backgroundImage: `url(${mem.image})` }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className={styles.fileInput}
                                        onChange={(e) => handleImageUpload('memories', 'image', e.target.files?.[0] || null, i)}
                                    />
                                    <div className={styles.fileInputLabel}>
                                        📸 {mem.image ? 'Change Image' : 'Upload Image'}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Caption</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    placeholder="e.g., Our First Day Together..."
                                    value={mem.caption}
                                    onChange={(e) => handleTextChange(`memories.${i}.caption` as const, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </section>

                {/* COMIC TEXTS */}
                <section className={styles.sectionGroup}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNumber}>3</span>
                        Comic Text Bubbles
                    </h2>

                    {[
                        { label: '💬 Collage Bubble 1', placeholder: 'So many memories!' },
                        { label: '💬 Collage Bubble 2', placeholder: 'Each one special' },
                        { label: '🦸 Hero Sticker Text', placeholder: 'WE!' },
                        { label: '💝 Final Message', placeholder: 'You are my greatest adventure.' }
                    ].map((item, i) => (
                        <div key={`comic-${i}`} className={styles.inputGroup}>
                            <label className={styles.label}>{item.label}</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={editData.comicTexts[i] || ''}
                                onChange={(e) => handleTextChange(`comicTexts.${i}` as const, e.target.value)}
                                placeholder={item.placeholder}
                            />
                        </div>
                    ))}
                </section>

            </div>

            <div className={styles.buttonGroup}>
                <button 
                    className={styles.saveButton} 
                    onClick={() => {
                        saveContent();
                        alert('✅ Saved! View your page at /v/spiderman/demo');
                    }}
                >
                    💾 SAVE & PUBLISH
                </button>
            </div>
        </div>
    );
}
