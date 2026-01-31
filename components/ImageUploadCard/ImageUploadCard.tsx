"use client";

import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import styles from './ImageUploadCard.module.css';

interface ImageUploadCardProps {
    image: string;
    label?: string;
    caption?: string;
    onImageChange: (dataUrl: string) => void;
    onCaptionChange?: (caption: string) => void;
    showCaption?: boolean;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
    image,
    label,
    caption,
    onImageChange,
    onCaptionChange,
    showCaption = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            // File too large - show inline message instead of alert
            console.warn('File must be under 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const url = ev.target?.result as string;
            onImageChange(url);
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={styles.card}>
            {label && <span className={styles.label}>{label}</span>}

            <div className={styles.previewContainer} onClick={handleClick}>
                {image ? (
                    <div
                        className={styles.preview}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <ImageIcon size={24} />
                        <span>No image</span>
                    </div>
                )}
                <div className={styles.overlay}>
                    <Upload size={20} />
                    <span>Upload</span>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={styles.hiddenInput}
                onChange={handleFileChange}
            />

            {showCaption && onCaptionChange && (
                <input
                    type="text"
                    className={styles.captionInput}
                    placeholder="Add caption..."
                    value={caption || ''}
                    onChange={(e) => onCaptionChange(e.target.value)}
                />
            )}
        </div>
    );
};

export default ImageUploadCard;
