'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

const TEMPLATE_TYPE = 'spiderman';

interface Project {
    id: string;
    owner_email: string;
    template_type: string;
    template_code: string;
    slug: string;
    data: any;
    is_published: boolean;
    editable_until?: string;
}

interface AuthContextType {
    session: Session | null;
    project: Project | null;
    isEditor: boolean;
    isLoading: boolean;
    loginError: string | null;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    login: (email: string, templateCode: string) => Promise<boolean>;
    logout: () => Promise<void>;
    saveProject: (data: any) => Promise<boolean>;
    publishProject: () => Promise<boolean>;
    getShareLink: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check for existing session on mount (from localStorage)
    useEffect(() => {
        console.log('AUTH: Checking initial session...');

        const checkStoredSession = async () => {
            if (typeof window === 'undefined') {
                setIsLoading(false);
                return;
            }

            const storedEmail = localStorage.getItem('auth_email');
            const storedTemplateCode = localStorage.getItem('auth_template_code');

            if (storedEmail && storedTemplateCode) {
                console.log('AUTH: Found stored credentials, verifying...');

                const { data: projectData, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('owner_email', storedEmail)
                    .eq('template_code', storedTemplateCode)
                    .eq('template_type', TEMPLATE_TYPE)
                    .single();

                if (!error && projectData) {
                    console.log('AUTH: Session restored from storage');
                    setSession({ user: { email: storedEmail } } as Session);
                    setProject(projectData);
                } else {
                    console.log('AUTH: Stored credentials invalid, clearing...');
                    localStorage.removeItem('auth_email');
                    localStorage.removeItem('auth_template_code');
                    localStorage.removeItem('auth_project_id');
                }
            }

            setIsLoading(false);
        };

        checkStoredSession();
    }, []);

    const login = useCallback(async (email: string, templateCode: string): Promise<boolean> => {
        console.log('AUTH: Attempting login for:', email, 'with template code');
        setLoginError(null);

        // Query project with email + template_code + template_type
        const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_email', email)
            .eq('template_code', templateCode)
            .eq('template_type', TEMPLATE_TYPE)
            .single();

        if (projectError) {
            console.log('AUTH: Login error:', projectError.message);
            if (projectError.code === 'PGRST116') {
                setLoginError('Invalid email or template code');
            } else {
                setLoginError('Login failed: ' + projectError.message);
            }
            return false;
        }

        if (!projectData) {
            console.log('AUTH: No project found');
            setLoginError('Invalid email or template code');
            return false;
        }

        console.log('AUTH: Login successful, project loaded:', projectData.id);
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_email', email);
            localStorage.setItem('auth_template_code', templateCode);
            localStorage.setItem('auth_project_id', projectData.id);
        }
        // Create a simple session object for tracking
        setSession({ user: { email } } as Session);
        setProject(projectData);
        setShowLoginModal(false);
        return true;
    }, []);

    const logout = useCallback(async () => {
        console.log('AUTH: Logging out...');
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_email');
            localStorage.removeItem('auth_template_code');
            localStorage.removeItem('auth_project_id');
        }
        setSession(null);
        setProject(null);
        console.log('AUTH: Logged out');
    }, []);

    const saveProject = useCallback(async (newData: any): Promise<boolean> => {
        if (!project) {
            console.log('AUTH: Cannot save - no project');
            return false;
        }

        console.log('AUTH: Saving project:', project.id);

        const { error } = await supabase
            .from('projects')
            .update({ data: newData })
            .eq('id', project.id);

        if (error) {
            console.log('AUTH: Save error:', error);
            return false;
        }

        console.log('AUTH: Save successful');
        setProject(prev => prev ? { ...prev, data: newData } : null);
        return true;
    }, [project]);

    const publishProject = useCallback(async (): Promise<boolean> => {
        if (!project) {
            console.log('AUTH: Cannot publish - no project');
            return false;
        }

        console.log('AUTH: Publishing project:', project.id);

        const { error } = await supabase
            .from('projects')
            .update({ is_published: true })
            .eq('id', project.id);

        if (error) {
            console.log('AUTH: Publish error:', error);
            return false;
        }

        console.log('AUTH: Publish successful');
        setProject(prev => prev ? { ...prev, is_published: true } : null);
        return true;
    }, [project]);

    const getShareLink = useCallback((): string => {
        if (!project?.slug) return '';
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/v/spiderman/${project.slug}`;
        }
        return `/v/spiderman/${project.slug}`;
    }, [project]);

    const isEditor = !!session && !!project;

    return (
        <AuthContext.Provider value={{
            session,
            project,
            isEditor,
            isLoading,
            loginError,
            showLoginModal,
            setShowLoginModal,
            login,
            logout,
            saveProject,
            publishProject,
            getShareLink,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
