import { useState } from "react";
import { ShieldCheck, KeyRound, Smartphone, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Seguridad() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-semibold">Seguridad</h1>
        <p className="text-sm text-muted-foreground">
          Administra la seguridad y el acceso a tu cuenta
        </p>
      </div>

      {/* Cambio de contraseña */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Contraseña actual</Label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <div className="grid gap-2">
            <Label>Nueva contraseña</Label>
            <Input type="password" placeholder="Mínimo 8 caracteres" />
          </div>

          <div className="grid gap-2">
            <Label>Confirmar nueva contraseña</Label>
            <Input type="password" placeholder="Repite la contraseña" />
          </div>

          <Button className="mt-2">Actualizar contraseña</Button>
        </CardContent>
      </Card>

      {/* Verificación en dos pasos */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Verificación en dos pasos</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Autenticación en dos pasos (2FA)
            </p>
            <p className="text-sm text-muted-foreground">
              Añade una capa extra de seguridad a tu cuenta
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </CardContent>
      </Card>

      {/* Sesiones activas */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <CardTitle>Sesiones activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sesión actual */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Windows · Chrome
              </p>
              <p className="text-xs text-muted-foreground">
                Bogotá, Colombia · Activa ahora
              </p>
            </div>
            <span className="text-xs text-green-600 font-medium">
              Sesión actual
            </span>
          </div>

          <Separator />

          {/* Otra sesión */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Android · Chrome
              </p>
              <p className="text-xs text-muted-foreground">
                Medellín, Colombia · Hace 2 días
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
