import { supabase } from "@/lib/supabaseClient";
import ViewerClient from "./ViewerClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ViewPage({ params }: PageProps) {
    const { slug } = await params;

    console.log("PUBLIC VIEW: Fetching project with slug:", slug);
    console.log("PUBLIC VIEW: Query params - slug:", slug, "template_type: spiderman", "is_published: true");

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("template_type", "spiderman")
        .eq("is_published", true)
        .single();

    console.log("PUBLIC PROJECT:", data, error);

    if (error) {
        console.log("PUBLIC VIEW ERROR:", error.message, error.code);
    }

    if (!data) {
        console.log("PUBLIC VIEW: No data returned - project not found or not published");
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                fontFamily: 'system-ui, sans-serif'
            }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</h1>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Not Found</h2>
                    <p style={{ opacity: 0.7 }}>This story hasn&apos;t been published yet or doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    console.log("PUBLIC VIEW: Project loaded successfully");
    console.log("PUBLIC VIEW: Project ID:", data.id);
    console.log("PUBLIC VIEW: Project slug:", data.slug);
    console.log("PUBLIC VIEW: Project is_published:", data.is_published);
    console.log("PUBLIC VIEW: Project data type:", typeof data.data);
    console.log("PUBLIC VIEW: Project data keys:", data.data ? Object.keys(data.data) : 'null');
    console.log("PUBLIC VIEW: Project data preview:", JSON.stringify(data.data).slice(0, 500));

    return <ViewerClient projectData={data.data || {}} />;
}
