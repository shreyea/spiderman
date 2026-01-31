"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pencil } from 'lucide-react';
import styles from './InlineEditor.module.css';

interface InlineEditorProps {
  text: string;
  isEditor?: boolean;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  onSave: (value: string) => void;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  text,
  isEditor = false,
  multiline = false,
  className,
  placeholder,
  onSave
}) => {
  // CRITICAL: Track whether we're actively editing to prevent external state updates
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const initializedRef = useRef(false);

  // Initialize local value ONLY once on mount or when text changes while NOT editing
  useEffect(() => {
    if (!editing) {
      setLocalValue(text || '');
      initializedRef.current = true;
    }
  }, [text, editing]);

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const len = inputRef.current.value.length;
      if ('setSelectionRange' in inputRef.current) {
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [editing]);

  const startEdit = useCallback((e?: React.MouseEvent) => {
    if (!isEditor) return;
    e?.stopPropagation();
    e?.preventDefault();
    setEditing(true);
  }, [isEditor]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Update ONLY local state - don't trigger parent updates while typing
    setLocalValue(e.target.value);
  }, []);

  const commit = useCallback(() => {
    setEditing(false);
    // Only save if value actually changed
    if (localValue !== text) {
      onSave(localValue);
    }
  }, [localValue, text, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      // Revert to original text on escape
      setLocalValue(text || '');
      setEditing(false);
    }
  }, [multiline, text]);

  // Viewer mode - just display text
  if (!isEditor) {
    return <span className={className}>{text}</span>;
  }

  // Editor mode
  return (
    <span
      className={`${styles.editorWrapper} ${className || ''} ${editing ? styles.isEditing : ''}`}
      onClick={!editing ? startEdit : undefined}
    >
      {!editing ? (
        <>
          <span className={styles.displayText}>
            {text || placeholder || 'Click to edit'}
          </span>
          <span className={styles.editHint}>
            <Pencil size={12} />
          </span>
        </>
      ) : (
        multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={styles.editInput}
            value={localValue}
            onChange={handleChange}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            className={styles.editInput}
            value={localValue}
            onChange={handleChange}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        )
      )}
    </span>
  );
};

export default InlineEditor;
