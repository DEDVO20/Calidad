import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Por favor configura SUPABASE_URL y SUPABASE_SERVICE_KEY en .env",
  );
}

// Cliente de Supabase con service key para operaciones del backend
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Sube un archivo a Supabase Storage desde el backend
 */
export async function uploadFileToSupabase(
  filename: string,
  fileBuffer: Buffer,
  bucket: string = "documentos",
): Promise<{ path: string; url: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "application/octet-stream",
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

/**
 * Lista archivos en un bucket
 */
export async function listFiles(
  bucket: string = "documentos",
  path?: string,
): Promise<any[]> {
  const { data, error } = await supabase.storage.from(bucket).list(path);

  if (error) {
    throw new Error(`Error al listar archivos: ${error.message}`);
  }

  return data || [];
}
