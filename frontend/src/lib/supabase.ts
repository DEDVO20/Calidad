import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Por favor configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sube un archivo a Supabase Storage
 */
export async function uploadFileToSupabase(
  file: Buffer | File,
  filename: string,
  bucket: string = "documentos",
): Promise<{ path: string; url: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Error al subir archivo: ${error.message}`);
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (error: any) {
    throw new Error(`Error en uploadFileToSupabase: ${error.message}`);
  }
}

/**
 * Elimina un archivo de Supabase Storage
 */
export async function deleteFileFromSupabase(
  filePath: string,
  bucket: string = "documentos",
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Error al eliminar archivo: ${error.message}`);
  }
}

/**
 * Obtiene URL firmada temporal (para archivos privados)
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600,
  bucket: string = "documentos",
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Error al generar URL firmada: ${error.message}`);
  }

  return data.signedUrl;
}
