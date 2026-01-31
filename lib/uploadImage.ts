import { supabase } from "./supabaseClient";

export async function uploadImage(file: File, path: string) {
    const { error } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
        .from("images")
        .getPublicUrl(path);

    return data.publicUrl;
}