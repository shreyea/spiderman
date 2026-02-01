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
    login: (email: string, password: string, templateCode: string) => Promise<boolean>;
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

    // Check for existing Supabase Auth session on mount
    useEffect(() => {
        console.log('AUTH: Checking initial session...');

        // Get current session
        supabase.auth.getSession().then(async ({ data: { session: authSession }, error }) => {
            if (error) {
                console.log('AUTH: Session error:', error);
            }
            
            console.log('AUTH: Initial session:', authSession ? 'Found' : 'None');
            setSession(authSession);

            // If we have a session, try to restore project from localStorage
            if (authSession?.user?.email) {
                const storedTemplateCode = localStorage.getItem('auth_template_code');
                if (storedTemplateCode) {
                    console.log('AUTH: Found stored template code, fetching project...');
                    
                    const { data: projectData, error: projectError } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('owner_email', authSession.user.email)
                        .eq('template_type', TEMPLATE_TYPE)
                        .eq('template_code', storedTemplateCode)
                        .single();

                    console.log('Email:', authSession.user.email);
                    console.log('Template type:', TEMPLATE_TYPE);
                    console.log('Template code:', storedTemplateCode);
                    console.log('Project:', projectData);
                    console.log('Error:', projectError);

                    if (!projectError && projectData) {
                        console.log('AUTH: Project restored:', projectData.id);
                        setProject(projectData);
                    } else {
                        console.log('AUTH: Could not restore project, clearing stored code');
                        localStorage.removeItem('auth_template_code');
                    }
                }
            }

            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, authSession) => {
            console.log('AUTH: State changed:', _event);
            setSession(authSession);

            if (!authSession) {
                setProject(null);
                localStorage.removeItem('auth_template_code');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string, templateCode: string): Promise<boolean> => {
        console.log('AUTH: Attempting Supabase Auth login for:', email);
        setLoginError(null);

        // Step 1: Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.log('AUTH: Supabase Auth error:', authError.message);
            setLoginError(authError.message);
            return false;
        }

        if (!authData.session) {
            console.log('AUTH: No session returned');
            setLoginError('Login failed - no session');
            return false;
        }

        console.log('AUTH: Supabase Auth successful, fetching project...');
        setSession(authData.session);

        // Step 2: Query project with owner_email + template_type + template_code
        const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_email', authData.session.user.email)
            .eq('template_type', TEMPLATE_TYPE)
            .eq('template_code', templateCode)
            .single();

        console.log('Email:', authData.session.user.email);
        console.log('Template type:', TEMPLATE_TYPE);
        console.log('Template code:', templateCode);
        console.log('Project:', projectData);
        console.log('Error:', projectError);

        if (projectError) {
            console.log('AUTH: Project fetch error:', projectError.message);
            if (projectError.code === 'PGRST116') {
                setLoginError('No project found with this template code');
            } else {
                setLoginError('Failed to load project: ' + projectError.message);
            }
            return false;
        }

        if (!projectData) {
            console.log('AUTH: No project found');
            setLoginError('No project found with this template code');
            return false;
        }

        console.log('AUTH: Login successful, project loaded:', projectData.id);
        
        // Store template code for session restoration
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_template_code', templateCode);
        }
        
        setProject(projectData);
        setShowLoginModal(false);
        return true;
    }, []);

    const logout = useCallback(async () => {
        console.log('AUTH: Logging out...');
        await supabase.auth.signOut();
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_template_code');
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
