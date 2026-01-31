import { supabase } from "@/lib/supabaseClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ViewPage({ params }: PageProps) {
    const { slug } = await params;

    console.log("PUBLIC VIEW: Fetching project with slug:", slug);

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("template_type", "spiderman")
        .eq("is_published", true)
        .single();

    if (error) {
        console.log("PUBLIC VIEW ERROR:", error);
    }

    if (!data) return <h1>Not published yet or not found</h1>;

    console.log("PUBLIC VIEW: Project loaded:", data.id);

    return (
        <div>
            <h1>{data.data?.heroText || "Welcome"}</h1>
        </div>
    );
}
