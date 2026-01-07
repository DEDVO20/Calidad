import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { procesoService, Proceso } from '@/services/proceso.service';

export default function MapaProcesosDiagrama() {
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await procesoService.getAll();
        setProcesos(data || []);
        // Simple node layout: place nodes in a grid
        const cols = 3;
        const computed: Node[] = (data || []).map((p: Proceso, i: number) => ({
          id: p.id,
          data: { label: `[${p.codigo}] ${p.nombre}` },
          position: { x: (i % cols) * 260, y: Math.floor(i / cols) * 140 },
        }));
        setNodes(computed);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-4">Diagrama de Procesos (Interactividad básica)</h1>
        <p className="text-sm text-[#6B7280] mb-4">Este componente usa <strong>reactflow</strong>. Instala con <code>npm install reactflow</code>.</p>
        <div style={{ height: 600, background: '#fff', borderRadius: 8 }}>
          <ReactFlow nodes={nodes} edges={[]} fitView attributionPosition="bottom-left">
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
