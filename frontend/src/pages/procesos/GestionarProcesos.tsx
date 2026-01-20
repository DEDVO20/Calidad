import { useEffect, useState } from "react";
import { Building2, Plus, Edit, Eye, Trash2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { procesoService, Proceso } from "@/services/proceso.service";

export default function GestionarProcesos() {
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selected, setSelected] = useState<Proceso | null>(null);
  const [form, setForm] = useState({ codigo: '', nombre: '', descripcion: '', inicio: '', fechaInicio: '', sitio: '', responsableNombre: '', etapas: [] as any[], puntosControl: [] as any[] });

  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await procesoService.getAll();
      setProcesos(data || []);
    } catch (err: any) {
      setError(err.message || 'Error cargando procesos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setDialogMode('create');
    setForm({ codigo: '', nombre: '', descripcion: '', inicio: '', fechaInicio: '', sitio: '', responsableNombre: '', etapas: [], puntosControl: [] });
    setSelected(null);
    setShowDialog(true);
  };

  const handleView = (p: Proceso) => {
    setDialogMode('view');
    setSelected(p);
    setForm({ codigo: p.codigo, nombre: p.nombre, descripcion: p.descripcion || '', inicio: p.inicio || '', fechaInicio: p.fechaInicio || '', sitio: p.sitio || '', responsableNombre: p.responsableNombre || '', etapas: p.etapas || [], puntosControl: p.puntosControl || [] });
    setShowDialog(true);
  };

  const handleEdit = (p: Proceso) => {
    setDialogMode('edit');
    setSelected(p);
    setForm({ codigo: p.codigo, nombre: p.nombre, descripcion: p.descripcion || '', inicio: p.inicio || '', fechaInicio: p.fechaInicio || '', sitio: p.sitio || '', responsableNombre: p.responsableNombre || '', etapas: p.etapas || [], puntosControl: p.puntosControl || [] });
    setShowDialog(true);
  };

  const handleDelete = async (p: Proceso) => {
    if (!confirm(`¿Eliminar proceso ${p.nombre}?`)) return;
    try {
      await procesoService.delete(p.id);
      await fetchProcesos();
      alert('Proceso eliminado');
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  const handleSave = async () => {
    try {
      if (!form.codigo.trim() || !form.nombre.trim()) {
        alert('Código y nombre obligatorios');
        return;
      }
      if (dialogMode === 'create') {
        await procesoService.create({ codigo: form.codigo, nombre: form.nombre, descripcion: form.descripcion, inicio: form.inicio, fechaInicio: form.fechaInicio, sitio: form.sitio, responsableNombre: form.responsableNombre, etapas: form.etapas, puntosControl: form.puntosControl });
        alert('Proceso creado');
      } else if (selected) {
        await procesoService.update(selected.id, { codigo: form.codigo, nombre: form.nombre, descripcion: form.descripcion, inicio: form.inicio, fechaInicio: form.fechaInicio, sitio: form.sitio, responsableNombre: form.responsableNombre, etapas: form.etapas, puntosControl: form.puntosControl });
        alert('Proceso actualizado');
      }
      setShowDialog(false);
      await fetchProcesos();
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4">Cargando procesos...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <Building2 className="h-7 w-7 text-[#2563EB]" /> Gestión de Procesos
              </h1>
              <p className="text-[#6B7280] mt-1">Crea y administra procesos del sistema</p>
            </div>
            <Button onClick={handleCreate} className="bg-[#2563EB] text-white">
              <Plus className="mr-2 h-4 w-4"/> Nuevo Proceso
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-700">{error}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A]">Listado de Procesos</CardTitle>
            <CardDescription className="text-[#6B7280]">Administrar códigos y nombres de procesos</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9] border-b">
                  <tr>
                    <th className="text-left p-6">Código</th>
                    <th className="text-left p-6">Nombre</th>
                    <th className="text-left p-6">Descripción</th>
                    <th className="text-right p-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {procesos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-[#6B7280]">No hay procesos registrados</td>
                    </tr>
                  ) : procesos.map((p) => (
                    <tr key={p.id} className="hover:bg-[#EFF6FF]">
                      <td className="p-6"><Badge className="bg-[#E0EDFF] text-[#2563EB]">{p.codigo}</Badge></td>
                      <td className="p-6 font-medium">{p.nombre}</td>
                      <td className="p-6 text-[#6B7280]">{p.descripcion || <i>Sin descripción</i>}</td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button size="sm" variant="ghost" onClick={() => handleView(p)}><Eye/></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(p)}><Edit/></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(p)}><Trash2/></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {dialogMode === 'create' && 'Nuevo Proceso'}
              {dialogMode === 'edit' && 'Editar Proceso'}
              {dialogMode === 'view' && 'Detalle del Proceso'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div>
              <Label>Código *</Label>
              <Input value={dialogMode === 'view' ? selected?.codigo ?? '' : form.codigo} onChange={(e)=>setForm({...form, codigo: e.target.value.toUpperCase()})} disabled={dialogMode==='view'} className="mt-1" />
            </div>
            <div>
              <Label>Nombre *</Label>
              <Input value={dialogMode === 'view' ? selected?.nombre ?? '' : form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} disabled={dialogMode==='view'} className="mt-1" />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input value={dialogMode === 'view' ? selected?.descripcion ?? '' : form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} disabled={dialogMode==='view'} className="mt-1" />
            </div>
            <div>
              <Label>Responsable</Label>
              <Input value={dialogMode === 'view' ? selected?.responsableNombre ?? '' : form.responsableNombre} onChange={(e)=>setForm({...form, responsableNombre: e.target.value})} disabled={dialogMode==='view'} className="mt-1" />
            </div>
            <div>
              <Label>Inicio (punto/etapa)</Label>
              <Input value={dialogMode === 'view' ? selected?.inicio ?? '' : form.inicio} onChange={(e)=>setForm({...form, inicio: e.target.value})} disabled={dialogMode==='view'} className="mt-1" />
            </div>
            <div>
              <Label>Fecha de Inicio</Label>
              <Input type="date" value={dialogMode === 'view' ? (selected?.fechaInicio ?? '') : form.fechaInicio} onChange={(e)=>setForm({...form, fechaInicio: e.target.value})} disabled={dialogMode==='view'} className="mt-1" />
            </div>
            <div>
              <Label>Sitio / Ubicación</Label>
              <Input value={dialogMode === 'view' ? selected?.sitio ?? '' : form.sitio} onChange={(e)=>setForm({...form, sitio: e.target.value})} disabled={dialogMode==='view'} className="mt-1" />
            </div>

            {/* Etapas */}
            <div className="col-span-1 md:col-span-2">
              <Label className="block">Etapas</Label>
              {form.etapas.length === 0 && <div className="text-sm text-[#6B7280] mt-2">Sin etapas</div>}
              {form.etapas.map((et: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mt-2">
                  <div className="flex-1 text-sm">{et.orden ? `${et.orden}. ` : ''}{et.nombre} {et.responsableNombre ? `- ${et.responsableNombre}` : ''}</div>
                  {dialogMode !== 'view' && (
                    <Button size="sm" variant="ghost" onClick={() => setForm({...form, etapas: form.etapas.filter((_: any, i: number) => i !== idx)})}>Eliminar</Button>
                  )}
                </div>
              ))}
              {dialogMode !== 'view' && (
                <AddEtapa onAdd={(et) => setForm({...form, etapas: [...form.etapas, et]})} />
              )}
            </div>

            {/* Puntos de Control */}
            <div className="col-span-1 md:col-span-2">
              <Label className="block">Puntos de Control</Label>
              {form.puntosControl.length === 0 && <div className="text-sm text-[#6B7280] mt-2">Sin puntos de control</div>}
              {form.puntosControl.map((pc: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mt-2">
                  <div className="flex-1 text-sm">{pc.nombre} {pc.criterio ? `- ${pc.criterio}` : ''}</div>
                  {dialogMode !== 'view' && (
                    <Button size="sm" variant="ghost" onClick={() => setForm({...form, puntosControl: form.puntosControl.filter((_: any, i: number) => i !== idx)})}>Eliminar</Button>
                  )}
                </div>
              ))}
              {dialogMode !== 'view' && (
                <AddPuntoControl onAdd={(pc) => setForm({...form, puntosControl: [...form.puntosControl, pc]})} />
              )}
            </div>
            {dialogMode !== 'view' && (
              <div className="flex justify-end gap-2">
                <Button onClick={()=>setShowDialog(false)} variant="ghost">Cancelar</Button>
                <Button onClick={handleSave} className="bg-[#2563EB] text-white">Guardar</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddEtapa({ onAdd }: { onAdd: (et: any) => void }) {
  const [nombre, setNombre] = useState('');
  const [responsableNombre, setResponsableNombre] = useState('');
  const [orden, setOrden] = useState<number | ''>('');
  return (
    <div className="mt-2 flex gap-2 items-center">
      <Input placeholder="Nombre etapa" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="flex-1" />
      <Input placeholder="Responsable" value={responsableNombre} onChange={(e)=>setResponsableNombre(e.target.value)} className="w-48" />
      <Input placeholder="Orden" type="number" value={orden as any} onChange={(e)=>setOrden(e.target.value ? Number(e.target.value) : '')} className="w-24" />
      <Button onClick={()=>{ if(!nombre) return; onAdd({ nombre, responsableNombre, orden: orden || undefined }); setNombre(''); setResponsableNombre(''); setOrden(''); }} className="bg-[#10B981] text-white">Agregar</Button>
    </div>
  );
}

function AddPuntoControl({ onAdd }: { onAdd: (pc: any) => void }) {
  const [nombre, setNombre] = useState('');
  const [criterio, setCriterio] = useState('');
  return (
    <div className="mt-2 flex gap-2 items-center">
      <Input placeholder="Nombre punto" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="flex-1" />
      <Input placeholder="Criterio" value={criterio} onChange={(e)=>setCriterio(e.target.value)} className="w-64" />
      <Button onClick={()=>{ if(!nombre) return; onAdd({ nombre, criterio }); setNombre(''); setCriterio(''); }} className="bg-[#10B981] text-white">Agregar</Button>
    </div>
  );
}
