import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY) en el entorno.",
  );
}

/* Singleton para evitar múltiples instancias en entornos serverless */
declare global {
  // eslint-disable-next-line no-var
  var __supabase_client: any | undefined;
}

const supabaseClient = globalThis.__supabase_client ?? createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

if (!globalThis.__supabase_client) {
  globalThis.__supabase_client = supabaseClient;
}

export const supabase = supabaseClient;

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

    if (!data || typeof (data as any).path !== "string") {
      throw new Error(`Respuesta inesperada al subir archivo: ${JSON.stringify(data)}`);
    }

    const path = (data as any).path;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = urlData?.publicUrl ?? "";

    return {
      path,
      url: publicUrl,
    };
  } catch (err: any) {
    throw new Error(`Error en uploadFileToSupabase: ${err?.message ?? String(err)}`);
  }
}

/**
 * Elimina un archivo de Supabase Storage
 */
export async function deleteFileFromSupabase(
  filePath: string,
  bucket: string = "documentos",
): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw new Error(`Error al eliminar archivo: ${error.message}`);
  } catch (err: any) {
    throw new Error(`Error en deleteFileFromSupabase: ${err?.message ?? String(err)}`);
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
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresIn);
  if (error) throw new Error(`Error al generar URL firmada: ${error.message}`);
  return (data as any)?.signedUrl ?? "";
}

/**
 * Lista archivos en un bucket
 */
export async function listFiles(
  bucket: string = "documentos",
  path?: string,
): Promise<any[]> {
  const { data, error } = await supabase.storage.from(bucket).list(path);
  if (error) throw new Error(`Error al listar archivos: ${error.message}`);
  return data || [];
}
