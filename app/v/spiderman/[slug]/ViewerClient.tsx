'use client';

import React from 'react';
import { HomePageContent } from '../../../../components';
import { ContentProvider } from '../../../../context/ContentContext';
import { AuthProvider } from '../../../../context/AuthContext';

interface ViewerClientProps {
    projectData: any;
}

const ViewerClient: React.FC<ViewerClientProps> = ({ projectData }) => {
    console.log('VIEWER CLIENT: Received projectData');
    console.log('VIEWER CLIENT: Data type:', typeof projectData);
    console.log('VIEWER CLIENT: Data keys:', projectData ? Object.keys(projectData) : 'null');
    console.log('VIEWER CLIENT: Data preview:', JSON.stringify(projectData).slice(0, 300));

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

