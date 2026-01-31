"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const TEMPLATE_TYPE = "spiderman";

export default function EditorPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [project, setProject] = useState<any>(null);
    const [editData, setEditData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("EDITOR: Checking session...");

        supabase.auth.getSession().then(({ data, error }) => {
            console.log("EDITOR SESSION:", data.session ? "Found" : "Not found");
            if (error) console.log("EDITOR SESSION ERROR:", error);

            if (!data.session) {
                console.log("EDITOR: No session, redirecting to /login");
                router.push("/login");
                return;
            }
            setSession(data.session);
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("EDITOR: Auth state changed:", _event);
            if (!session) {
                router.push("/login");
                return;
            }
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        if (session) {
            fetchProject();
        }
    }, [session]);

    const fetchProject = async () => {
        console.log("EDITOR: Fetching project for:", session.user.email);

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("owner_email", session.user.email)
            .eq("template_type", TEMPLATE_TYPE)
            .maybeSingle();

        if (error) {
            console.log("EDITOR FETCH ERROR:", error);
            setError("Failed to load project: " + error.message);
            return;
        }

        if (!data) {
            console.log("EDITOR: No project found for user");
            setError("No project found for this user. Please contact support.");
            return;
        }

        console.log("EDITOR: Project loaded:", data.id, "Slug:", data.slug);
        setProject(data);
        setEditData(data.data || {});
    };

    const saveProject = async () => {
        console.log("EDITOR: Saving project...", project.id);

        const { error } = await supabase
            .from("projects")
            .update({ data: editData })
            .eq("id", project.id);

        if (error) {
            console.log("EDITOR SAVE ERROR:", error);
            alert("Save failed: " + error.message);
        } else {
            console.log("EDITOR: Save successful");
            alert("Saved!");
        }
    };

    const publishProject = async () => {
        console.log("EDITOR: Publishing project...", project.id);

        const { error } = await supabase
            .from("projects")
            .update({ is_published: true })
            .eq("id", project.id);

        if (error) {
            console.log("EDITOR PUBLISH ERROR:", error);
            alert("Publish failed: " + error.message);
        } else {
            console.log("EDITOR: Publish successful");
            alert("Published! Your share link is ready.");
        }
    };

    if (loading) return <div>Checking authentication...</div>;
    if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    if (!session) return <div>Redirecting to login...</div>;
    if (!project) return <div>Loading project...</div>;

    const shareLink = typeof window !== 'undefined'
        ? window.location.origin + "/v/spiderman/" + project.slug
        : "/v/spiderman/" + project.slug;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Editor</h1>

            <div style={{ marginBottom: '20px' }}>
                <label>Hero Text:</label>
                <textarea
                    value={editData.heroText || ""}
                    onChange={(e) =>
                        setEditData({ ...editData, heroText: e.target.value })
                    }
                    style={{ width: '100%', minHeight: '100px', marginTop: '5px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={saveProject} style={{ padding: '10px 20px' }}>Save</button>
                <button onClick={publishProject} style={{ padding: '10px 20px' }}>Publish</button>
            </div>

            <p>
                <strong>Share Link:</strong>{" "}
                <a href={shareLink} target="_blank" rel="noopener noreferrer">
                    {shareLink}
                </a>
            </p>
        </div>
    );
}
