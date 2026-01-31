'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

const TEMPLATE_TYPE = 'spiderman';

interface Project {
    id: string;
    owner_email: string;
    template_type: string;
    template_password: string;
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
    templateError: string | null;
    showLoginModal: boolean;
    showTemplateModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    login: (email: string, password: string, templatePassword?: string) => Promise<boolean>;
    logout: () => Promise<void>;
    verifyTemplatePassword: (password: string) => Promise<boolean>;
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
    const [templateError, setTemplateError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    // Check session on mount
    useEffect(() => {
        console.log('AUTH: Checking initial session...');

        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                console.log('AUTH: Session error:', error);
            }
            console.log('AUTH: Initial session:', data.session ? 'Found' : 'None');
            setSession(data.session);
            // Don't auto-show template modal - let user click login to start auth flow
            setIsLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('AUTH: State changed:', _event);
            setSession(session);

            if (!session) {
                setProject(null);
                setShowTemplateModal(false);
            }
            // Don't auto-show template modal on auth state change
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string, templatePassword?: string): Promise<boolean> => {
        console.log('AUTH: Attempting login for:', email);
        setLoginError(null);
        setTemplateError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log('AUTH: Login error:', error.message);
            setLoginError(error.message);
            return false;
        }

        console.log('AUTH: Login successful');
        setSession(data.session);

        // If template password provided, verify it immediately
        if (templatePassword && data.session?.user?.email) {
            console.log('AUTH: Verifying template password...');

            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .eq('owner_email', data.session.user.email)
                .eq('template_type', TEMPLATE_TYPE)
                .eq('template_password', templatePassword)
                .maybeSingle();

            if (projectError) {
                console.log('AUTH: Template verification error:', projectError);
                setLoginError('Failed to verify template: ' + projectError.message);
                return false;
            }

            if (!projectData) {
                console.log('AUTH: No project found with this template password');
                setLoginError('Invalid template password or no project found');
                return false;
            }

            console.log('AUTH: Template verified, project loaded:', projectData.id);
            setProject(projectData);
            setShowLoginModal(false);
            setShowTemplateModal(false);
            return true;
        }

        // No template password provided - show template modal
        setShowLoginModal(false);
        setShowTemplateModal(true);
        return true;
    }, []);

    const logout = useCallback(async () => {
        console.log('AUTH: Logging out...');
        await supabase.auth.signOut();
        setSession(null);
        setProject(null);
        setShowTemplateModal(false);
        console.log('AUTH: Logged out');
    }, []);

    const verifyTemplatePassword = useCallback(async (password: string): Promise<boolean> => {
        if (!session?.user?.email) {
            setTemplateError('No session found');
            return false;
        }

        console.log('AUTH: Verifying template password for:', session.user.email);
        setTemplateError(null);

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_email', session.user.email)
            .eq('template_type', TEMPLATE_TYPE)
            .eq('template_password', password)
            .maybeSingle();

        if (error) {
            console.log('AUTH: Template verification error:', error);
            setTemplateError('Failed to verify: ' + error.message);
            return false;
        }

        if (!data) {
            console.log('AUTH: No project found with this password');
            setTemplateError('Invalid template password or no project found');
            return false;
        }

        console.log('AUTH: Template verified, project loaded:', data.id);
        setProject(data);
        setShowTemplateModal(false);
        return true;
    }, [session]);

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
            templateError,
            showLoginModal,
            showTemplateModal,
            setShowLoginModal,
            login,
            logout,
            verifyTemplatePassword,
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
