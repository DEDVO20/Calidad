import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { procesoService, Proceso } from "@/services/proceso.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MapaProcesos() {
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Proceso | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ inicio: '', fechaInicio: '', sitio: '' });

  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = async () => {
    try {
      setLoading(true);
      const data = await procesoService.getAll();
      setProcesos(data || []);
    } catch (err: any) {
      setError(err.message || 'Error cargando procesos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Cargando mapa de procesos...</div>;

  return (
    <div className="min-h-screen p-6 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Mapa de Procesos</h1>
          <div className="text-sm text-[#6B7280]">Distribución visual simple de procesos</div>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <Card>
          <CardHeader className="bg-[#F1F5F9]"><CardTitle>Mapa</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {procesos.map((p) => (
                <div key={p.id} onClick={async () => { setSelected(p); setForm({ inicio: p.inicio || '', fechaInicio: p.fechaInicio || '', sitio: p.sitio || '' }); setEditMode(false); }} className="cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-md">
                  <div className="font-semibold text-[#1E3A8A]">[{p.codigo}] {p.nombre}</div>
                  <div className="text-sm text-[#6B7280] mt-2">{p.descripcion || 'Sin descripción'}</div>
                  {p.responsableNombre && <div className="mt-2 text-sm text-[#374151]"><strong>Responsable:</strong> {p.responsableNombre}</div>}
                  <div className="mt-3 text-sm text-[#374151]">
                    <div><strong>Inicia:</strong> {p.inicio || '—'}</div>
                    <div><strong>Fecha:</strong> {p.fechaInicio ? new Date(p.fechaInicio).toLocaleDateString('es-CO') : '—'}</div>
                    <div><strong>Sitio:</strong> {p.sitio || '—'}</div>
                  </div>
                  {(p.etapas && p.etapas.length>0) && (
                    <div className="mt-3 text-sm text-[#374151]">
                      <strong>Etapas:</strong>
                      <ul className="list-disc ml-6">
                        {p.etapas.map((et:any, i:number)=>(<li key={i}>{et.orden ? `${et.orden}. ` : ''}{et.nombre}{et.responsableNombre ? ` - ${et.responsableNombre}` : ''}</li>))}
                      </ul>
                    </div>
                  )}
                  {(p.puntosControl && p.puntosControl.length>0) && (
                    <div className="mt-2 text-sm text-[#374151]">
                      <strong>Puntos de control:</strong>
                      <ul className="list-disc ml-6">
                        {p.puntosControl.map((pc:any,i:number)=>(<li key={i}>{pc.nombre}{pc.criterio ? ` - ${pc.criterio}` : ''}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? `${selected.codigo} - ${selected.nombre}` : ''}</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-[#6B7280]">{selected?.descripcion}</p>
            {!editMode ? (
              <div className="text-sm">
                {selected?.responsableNombre && <div><strong>Responsable:</strong> {selected?.responsableNombre}</div>}
                <div><strong>Inicio:</strong> {selected?.inicio || '—'}</div>
                <div><strong>Fecha de inicio:</strong> {selected?.fechaInicio ? new Date(selected!.fechaInicio!).toLocaleDateString('es-CO') : '—'}</div>
                <div><strong>Sitio:</strong> {selected?.sitio || '—'}</div>
                {(selected?.etapas && selected.etapas.length>0) && (
                  <div className="mt-2">
                    <strong>Etapas:</strong>
                    <ul className="list-disc ml-6 text-sm">
                      {selected.etapas.map((et:any,i:number)=>(<li key={i}>{et.orden ? `${et.orden}. ` : ''}{et.nombre}{et.responsableNombre ? ` - ${et.responsableNombre}` : ''}</li>))}
                    </ul>
                  </div>
                )}
                {(selected?.puntosControl && selected.puntosControl.length>0) && (
                  <div className="mt-2">
                    <strong>Puntos de control:</strong>
                    <ul className="list-disc ml-6 text-sm">
                      {selected.puntosControl.map((pc:any,i:number)=>(<li key={i}>{pc.nombre}{pc.criterio ? ` - ${pc.criterio}` : ''}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                <div>
                  <Label>Inicio</Label>
                  <Input value={form.inicio} onChange={(e)=>setForm({...form, inicio: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label>Fecha de Inicio</Label>
                  <Input type="date" value={form.fechaInicio} onChange={(e)=>setForm({...form, fechaInicio: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label>Sitio</Label>
                  <Input value={form.sitio} onChange={(e)=>setForm({...form, sitio: e.target.value})} className="mt-1" />
                </div>
              </div>
            )}

            <div className="mt-4 text-right flex gap-2 justify-end">
              {!editMode && <Button onClick={()=>setEditMode(true)}>Editar</Button>}
              {editMode && <Button onClick={async ()=>{
                if (!selected) return;
                try {
                  await procesoService.update(selected.id, { inicio: form.inicio, fechaInicio: form.fechaInicio, sitio: form.sitio });
                  const updated = await procesoService.getById(selected.id);
                  setSelected(updated);
                  await fetchProcesos();
                  setEditMode(false);
                } catch (err: any) {
                  alert(err.message || 'Error al guardar');
                }
              }} className="bg-[#2563EB] text-white">Guardar</Button>}
              <Button onClick={() => { setSelected(null); setEditMode(false); }} variant="ghost">Cerrar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
