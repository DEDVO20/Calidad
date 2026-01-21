import { UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Configuracion() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
          <UserCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">
            Configuración
          </h1>
          <p className="text-sm text-blue-700">
            Administra la información básica de tu cuenta
          </p>
        </div>
      </div>

      {/* PERFIL DEL USUARIO */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Perfil del Usuario
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="space-y-1">
              <Label>Nombre completo</Label>
              <Input defaultValue="Administrador Sistema" />
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <Label>Teléfono</Label>
              <Input placeholder="+57 300 000 0000" />
            </div>

            {/* Correo principal */}
            <div className="space-y-1">
              <Label>Correo electrónico</Label>
              <Input value="admin@sgc.com" disabled />
            </div>

            {/* Correo de contacto */}
            <div className="space-y-1">
              <Label>Correo de contacto</Label>
              <Input placeholder="contacto@empresa.com" />
            </div>

            {/* Rol */}
            <div className="space-y-1">
              <Label>Rol</Label>
              <Input value="Administrador" disabled />
            </div>

            {/* Área */}
            <div className="space-y-1">
              <Label>Área asignada</Label>
              <Input value="Gestión de Calidad" disabled />
            </div>

            {/* Idioma */}
            <div className="space-y-1">
              <Label>Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zona horaria */}
            <div className="space-y-1">
              <Label>Zona horaria</Label>
              <Select defaultValue="America/Bogota">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Bogota">
                    (GMT-5) América / Bogotá
                  </SelectItem>
                  <SelectItem value="America/Mexico_City">
                    (GMT-6) México
                  </SelectItem>
                  <SelectItem value="America/Argentina/Buenos_Aires">
                    (GMT-3) Buenos Aires
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
