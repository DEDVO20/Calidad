import { useEffect, useState, useCallback, useRef } from "react";
import { UploadIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { uploadProfileImage, deleteProfileImage } from "@/services/storage";
import { getCurrentUser } from "@/services/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getToken } from "@/services/auth";

const API_URL = "/api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    nombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    correoElectronico: "",
    areaId: "",
    activo: false,
    fotoUrl: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [oldImagePath, setOldImagePath] = useState<string | null>(null);

  // Campos de cambio de contraseña
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentUser = getCurrentUser();
  const token = getToken();
  const usuarioId = currentUser?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cargarPerfil = useCallback(async () => {
    if (!usuarioId || !token) {
      toast.error("Sesión inválida. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/usuarios/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);

      // Intentar ambos formatos: foto_url (snake_case) y fotoUrl (camelCase)
      const imageUrl = res.data.fotoUrl || res.data.foto_url;
      setPreview(imageUrl || null);

      // Extraer el path de la imagen antigua para poder eliminarla después
      if (imageUrl) {
        const urlParts = imageUrl.split("/");
        const pathIndex = urlParts.findIndex(
          (part: string) => part === "imagenes",
        );
        if (pathIndex !== -1) {
          const path = urlParts.slice(pathIndex + 1).join("/");
          setOldImagePath(path);
        }
      }
    } catch {
      toast.error("No se pudo cargar el perfil.");
    } finally {
      setLoading(false);
    }
  }, [usuarioId, token]);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  /** Manejar cambios de texto */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /** Manejar cambio de foto */
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (!usuarioId || !token) {
      toast.error("Sesión inválida. Inicia sesión nuevamente.");
      return;
    }

    setSaving(true);

    try {
      let fotoUrl = profile.fotoUrl;

      // 1. Si hay nueva foto, subirla a Supabase
      if (foto) {
        setUploadingImage(true);
        toast.info("Subiendo imagen...");

        try {
          const uploadResult = await uploadProfileImage(foto, usuarioId);
          fotoUrl = uploadResult.url;

          // Eliminar imagen anterior si existe
          if (oldImagePath) {
            try {
              await deleteProfileImage(oldImagePath);
            } catch (error) {
              console.warn("No se pudo eliminar la imagen anterior:", error);
            }
          }

          toast.success("Imagen subida correctamente");
          setOldImagePath(uploadResult.path);
        } catch (error) {
          toast.error("Error al subir la imagen");
          console.error("Error uploading image:", error);
          setSaving(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // 2. Actualizar perfil en el backend
      interface UpdateData {
        nombre: string;
        segundoNombre: string;
        primerApellido: string;
        segundoApellido: string;
        correoElectronico: string;
        areaId: string;
        activo: boolean;
        foto_url: string;
        contrasena?: string;
      }

      const updateData: UpdateData = {
        nombre: profile.nombre,
        segundoNombre: profile.segundoNombre,
        primerApellido: profile.primerApellido,
        segundoApellido: profile.segundoApellido,
        correoElectronico: profile.correoElectronico,
        areaId: profile.areaId,
        activo: profile.activo,
        foto_url: fotoUrl, // Enviar como foto_url al backend (snake_case)
      };

      if (newPassword) {
        updateData.contrasena = newPassword;
      }

      await axios.patch(`${API_URL}/usuarios/${usuarioId}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar el estado local
      setProfile({ ...profile, fotoUrl: fotoUrl });
      setPreview(fotoUrl);
      setFoto(null);

      // Actualizar localStorage con la nueva foto (solo fotoUrl en camelCase)
      const storedUser = getCurrentUser();
      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          fotoUrl: fotoUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Perfil actualizado correctamente.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Error al guardar los cambios.");
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <Separator />

        <CardContent className="flex flex-col md:flex-row gap-6 py-6">
          {/* FOTO DE PERFIL */}
          <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
            <Avatar className="w-32 h-32 border">
              {preview ? (
                <AvatarImage src={preview} alt="Foto de perfil" />
              ) : (
                <AvatarFallback>
                  {profile.nombre
                    ? profile.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "?"}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col items-center gap-2 w-full">
              <Label htmlFor="foto" className="text-sm font-medium">
                Foto de perfil
              </Label>

              <input
                ref={fileInputRef}
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={uploadingImage || saving}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Subir foto
                  </>
                )}
              </Button>

              {foto && (
                <span className="text-xs text-muted-foreground text-center">
                  {foto.name}
                </span>
              )}
            </div>
          </div>

          {/* CAMPOS DE TEXTO */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Primer nombre</FieldLabel>
                <FieldContent>
                  <Input
                    name="nombre"
                    value={profile.nombre}
                    onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Segundo nombre</FieldLabel>
                <FieldContent>
                  <Input
                    name="segundoNombre"
                    value={profile.segundoNombre}
                    onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Primer apellido</FieldLabel>
                <FieldContent>
                  <Input
                    name="primerApellido"
                    value={profile.primerApellido}
                    onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Segundo apellido</FieldLabel>
                <FieldContent>
                  <Input
                    name="segundoApellido"
                    value={profile.segundoApellido}
                    onChange={handleChange}
                  />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Correo electrónico</FieldLabel>
              <FieldContent>
                <Input
                  name="correoElectronico"
                  type="email"
                  value={profile.correoElectronico}
                  onChange={handleChange}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Área</FieldLabel>
              <FieldContent>
                <Input
                  name="areaId"
                  value={profile.areaId}
                  onChange={handleChange}
                />
              </FieldContent>
            </Field>

            {/* CAMBIO DE CONTRASEÑA */}
            <Separator className="my-4" />
            <h3 className="font-semibold text-sm text-muted-foreground">
              Cambio de contraseña
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Nueva contraseña</FieldLabel>
                <FieldContent>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Confirmar contraseña</FieldLabel>
                <FieldContent>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </FieldContent>
                {newPassword &&
                  confirmPassword &&
                  newPassword !== confirmPassword && (
                    <FieldError>Las contraseñas no coinciden.</FieldError>
                  )}
              </Field>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={saving || uploadingImage}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Guardar cambios?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción actualizará tu información personal y contraseña
                  (si fue modificada). Asegúrate de que los datos sean correctos
                  antes de continuar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGuardar}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Confirmar y guardar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
