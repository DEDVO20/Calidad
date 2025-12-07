import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, CheckCircle, XCircle, FileSpreadsheet, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ImportResult {
    success: boolean;
    summary: {
        total: number;
        success: number;
        failed: number;
    };
    results: Array<{
        row: number;
        status: 'success' | 'error';
        data?: any;
        error?: string;
    }>;
}

export default function BulkImportUsuarios() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ImportResult | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
                setResults(null);
            }
        },
        onDropRejected: (fileRejections) => {
            const error = fileRejections[0]?.errors[0];
            if (error?.code === 'file-too-large') {
                toast.error('El archivo es demasiado grande. Máximo 5MB');
            } else if (error?.code === 'file-invalid-type') {
                toast.error('Formato de archivo no válido. Use Excel (.xlsx) o CSV (.csv)');
            } else {
                toast.error('Error al cargar el archivo');
            }
        }
    });

    const handleImport = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/usuarios/bulk-import', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                setResults(result);
                toast.success(
                    `Importación completada: ${result.summary.success} exitosos, ${result.summary.failed} fallidos`
                );
            } else {
                toast.error(result.message || 'Error al importar usuarios');
                setResults(null);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al procesar el archivo');
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = `documento,nombre,segundo_nombre,primer_apellido,segundo_apellido,correo_electronico,nombre_usuario,contrasena,area_codigo,roles,activo
12345678,Juan,Carlos,Pérez,García,juan.perez@empresa.com,jperez,Pass123!,CAL,ADMIN;USER,true
87654321,María,,González,López,maria.gonzalez@empresa.com,mgonzalez,Pass456!,RRHH,USER,true
11223344,Pedro,Antonio,Rodríguez,,pedro.rodriguez@empresa.com,prodriguez,Pass789!,SIS,USER,true`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'plantilla_usuarios.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Plantilla descargada');
    };

    const resetForm = () => {
        setFile(null);
        setResults(null);
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/usuarios')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileSpreadsheet className="h-7 w-7 text-purple-600" />
                        </div>
                        Importación Masiva de Usuarios
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Carga múltiples usuarios desde un archivo Excel o CSV
                    </p>
                </div>
            </div>

            {/* Instructions Card */}
            <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Instrucciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-800 space-y-2">
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Descarga la plantilla CSV con el formato requerido</li>
                        <li>Completa los datos de los usuarios siguiendo el formato</li>
                        <li>Sube el archivo completado usando el área de carga</li>
                        <li>Revisa los resultados y corrige errores si es necesario</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm font-semibold">Límites:</p>
                        <ul className="text-sm list-disc list-inside">
                            <li>Máximo 1000 usuarios por archivo</li>
                            <li>Tamaño máximo: 5MB</li>
                            <li>Formatos: .xlsx, .csv</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Download Template */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Descargar Plantilla</CardTitle>
                    <CardDescription>
                        Descarga la plantilla con el formato correcto para importar usuarios
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={downloadTemplate} variant="outline" className="w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Plantilla CSV
                    </Button>
                </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle>2. Cargar Archivo</CardTitle>
                    <CardDescription>
                        Arrastra tu archivo aquí o haz clic para seleccionarlo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${isDragActive
                                ? 'border-purple-500 bg-purple-50 scale-105'
                                : file
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-4">
                            {file ? (
                                <>
                                    <FileSpreadsheet className="w-16 h-16 text-green-600" />
                                    <div>
                                        <p className="text-lg font-medium text-green-900">{file.name}</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetForm();
                                        }}
                                    >
                                        Cambiar archivo
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-16 h-16 text-gray-400" />
                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            {isDragActive
                                                ? 'Suelta el archivo aquí'
                                                : 'Arrastra un archivo aquí o haz clic para seleccionar'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Excel (.xlsx) o CSV (.csv) - Máximo 5MB
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {file && !results && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={handleImport}
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Importar Usuarios
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results */}
            {results && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {results.success ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            )}
                            Resultados de Importación
                        </CardTitle>
                        <CardDescription>
                            {results.success
                                ? 'Todos los usuarios fueron importados exitosamente'
                                : 'Algunos usuarios no pudieron ser importados'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-3xl font-bold text-gray-900">{results.summary.total}</div>
                                <div className="text-sm text-gray-600 mt-1">Total Procesados</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <div className="text-3xl font-bold text-green-600">{results.summary.success}</div>
                                <div className="text-sm text-green-700 mt-1">Exitosos</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <div className="text-3xl font-bold text-red-600">{results.summary.failed}</div>
                                <div className="text-sm text-red-700 mt-1">Fallidos</div>
                            </div>
                        </div>

                        {/* Success List */}
                        {results.summary.success > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Usuarios Creados ({results.summary.success})
                                </h4>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {results.results
                                        .filter((r) => r.status === 'success')
                                        .map((r, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between text-sm bg-green-50 p-2 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                    <span className="font-medium">Fila {r.row}:</span>
                                                    <span className="text-green-700">
                                                        {r.data?.nombreUsuario} ({r.data?.correoElectronico})
                                                    </span>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    Creado
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Error List */}
                        {results.summary.failed > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-red-900 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Errores ({results.summary.failed})
                                </h4>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {results.results
                                        .filter((r) => r.status === 'error')
                                        .map((r, i) => (
                                            <div key={i} className="bg-red-50 p-3 rounded border border-red-200">
                                                <div className="flex items-start gap-2">
                                                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-red-900">Fila {r.row}</div>
                                                        <div className="text-sm text-red-700 mt-1">{r.error}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={resetForm}
                                className="flex-1"
                            >
                                Importar Otro Archivo
                            </Button>
                            <Button
                                onClick={() => navigate('/usuarios')}
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                            >
                                Ver Lista de Usuarios
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
