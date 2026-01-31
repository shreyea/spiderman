'use client';

import React from 'react';
import { HomePageContent, LoginModal, EditorControls } from '../components';
import { ContentProvider } from '../context/ContentContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function MainContent() {
  const { isEditor, project } = useAuth();

  return (
    <ContentProvider
      isEditor={isEditor}
      initialContent={project?.data}
    >
      <HomePageContent />
      <EditorControls />
      <LoginModal />
    </ContentProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
