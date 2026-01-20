import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentFormWithTipTap } from "@/components/documents/DocumentFormWithTipTap";
import { documentoService } from "@/services/documento.service";
import { uploadFileToSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, FileText } from "lucide-react";

export default function CreateDocument() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null);

      const file = formData.get("archivo") as File | null;

      if (file) {
        setUploading(true);
        toast.info("Subiendo archivo a Supabase...");

        const timestamp = Date.now();
        const sanitizedName = file.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "_");

        const filename = `${timestamp}-${sanitizedName}`;

        const { url } = await uploadFileToSupabase(file, filename, "documentos");

        formData.delete("archivo");
        formData.set("nombreArchivo", file.name);
        formData.set("rutaAlmacenamiento", url);
        formData.set("tipoMime", file.type);
        formData.set("tamañoBytes", file.size.toString());

        toast.success("Archivo subido correctamente");
        setUploading(false);
      }

      await documentoService.create(formData);

      setSuccess("Documento creado exitosamente");
      toast.success("Documento creado exitosamente");
      setTimeout(() => navigate("/documentos"), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <FileText className="h-9 w-9 text-[#2563EB]" />
                Crear Nuevo Documento
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Complete el formulario para registrar un nuevo documento en el sistema de calidad ISO 9001
              </p>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-[#FEF2F2] border border-[#EF4444] rounded-xl p-6 flex items-start gap-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-[#EF4444] flex-shrink-0" />
            <div>
              <p className="font-medium text-[#991B1B]">Error</p>
              <p className="text-[#DC2626] mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-[#ECFDF5] border border-[#22C55E] rounded-xl p-6 flex items-start gap-4 shadow-sm">
            <CheckCircle className="h-6 w-6 text-[#22C55E] flex-shrink-0" />
            <div>
              <p className="font-medium text-[#166534]">Éxito</p>
              <p className="text-[#16A34A] mt-1">{success}</p>
              <p className="text-[#15803D] mt-2">Redirigiendo a la lista de documentos...</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="bg-[#EFF6FF] border border-[#2563EB] rounded-xl p-6 flex items-start gap-4 shadow-sm">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
            <div>
              <p className="font-medium text-[#1E40AF]">Subiendo archivo...</p>
              <p className="text-[#2563EB] mt-1">Por favor espera mientras se carga el documento a Supabase Storage</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <DocumentFormWithTipTap
            onSubmit={handleSubmit}
            onCancel={() => navigate("/documentos")}
            mode="create"
          />
        </div>
      </div>
    </div>
  );
}