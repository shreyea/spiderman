'use client';

import React from 'react';
import { HomePageContent } from '../../../../components';
import { ContentProvider } from '../../../../context/ContentContext';
import { AuthProvider } from '../../../../context/AuthContext';

interface ViewerClientProps {
    projectData: any;
}

const ViewerClient: React.FC<ViewerClientProps> = ({ projectData }) => {
    console.log('VIEWER: Rendering with project data:', JSON.stringify(projectData).slice(0, 200));

    return (
        <AuthProvider>
            <ContentProvider
                isEditor={false}
                initialContent={projectData}
            >
                <HomePageContent />
            </ContentProvider>
        </AuthProvider>
    );
};

export default ViewerClient;

