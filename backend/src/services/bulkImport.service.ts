import XLSX from 'xlsx';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.model';
import Area from '../models/area.model';
import Rol from '../models/rol.model';
import UsuarioRol from '../models/usuarioRol.model';

interface RowValidation {
    valid: boolean;
    errors: string[];
}

interface RowResult {
    row: number;
    status: 'success' | 'error';
    data?: any;
    error?: string;
}

interface ImportResult {
    success: boolean;
    summary: {
        total: number;
        success: number;
        failed: number;
    };
    results: RowResult[];
}

export class BulkImportService {
    /**
     * Parse Excel or CSV file to JSON
     */
    static async parseFile(buffer: Buffer, mimetype: string): Promise<any[]> {
        if (mimetype.includes('sheet') || mimetype.includes('excel')) {
            return this.parseExcel(buffer);
        } else if (mimetype.includes('csv')) {
            return this.parseCSV(buffer);
        }
        throw new Error('Formato de archivo no soportado. Use Excel (.xlsx) o CSV (.csv)');
    }

    /**
     * Parse Excel file
     */
    static parseExcel(buffer: Buffer): any[] {
        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            return data;
        } catch (error: any) {
            throw new Error(`Error al parsear archivo Excel: ${error.message}`);
        }
    }

    /**
     * Parse CSV file
     */
    static parseCSV(buffer: Buffer): any[] {
        try {
            const csvString = buffer.toString('utf-8');
            const lines = csvString.split('\n').filter(line => line.trim());

            if (lines.length === 0) {
                return [];
            }

            const headers = lines[0].split(',').map(h => h.trim());
            const data: any[] = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const row: any = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }

            return data;
        } catch (error: any) {
            throw new Error(`Error al parsear archivo CSV: ${error.message}`);
        }
    }

    /**
     * Validate a single row
     */
    static async validateRow(row: any, rowNumber: number): Promise<RowValidation> {
        const errors: string[] = [];

        // Validar campos requeridos
        if (!row.documento) {
            errors.push('Documento es requerido');
        } else if (!/^\d+$/.test(String(row.documento))) {
            errors.push('Documento debe contener solo números');
        }

        if (!row.nombre || !String(row.nombre).trim()) {
            errors.push('Nombre es requerido');
        }

        if (!row.primer_apellido || !String(row.primer_apellido).trim()) {
            errors.push('Primer apellido es requerido');
        }

        if (!row.correo_electronico) {
            errors.push('Correo electrónico es requerido');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.correo_electronico)) {
            errors.push('Formato de correo electrónico inválido');
        }

        if (!row.nombre_usuario) {
            errors.push('Nombre de usuario es requerido');
        } else if (String(row.nombre_usuario).length < 3) {
            errors.push('Nombre de usuario debe tener al menos 3 caracteres');
        }

        if (!row.contrasena) {
            errors.push('Contraseña es requerida');
        } else if (String(row.contrasena).length < 6) {
            errors.push('Contraseña debe tener al menos 6 caracteres');
        }

        if (!row.area_codigo) {
            errors.push('Código de área es requerido');
        }

        if (!row.roles) {
            errors.push('Roles son requeridos');
        }

        // Si hay errores de formato, no continuar con validaciones de BD
        if (errors.length > 0) {
            return { valid: false, errors };
        }

        // Validar documento único
        const existingByDoc = await Usuario.findOne({
            where: { documento: parseInt(String(row.documento)) }
        });
        if (existingByDoc) {
            errors.push(`Documento ${row.documento} ya existe en el sistema`);
        }

        // Validar email único
        const existingByEmail = await Usuario.findOne({
            where: { correoElectronico: row.correo_electronico }
        });
        if (existingByEmail) {
            errors.push(`Email ${row.correo_electronico} ya existe en el sistema`);
        }

        // Validar usuario único
        const existingByUsername = await Usuario.findOne({
            where: { nombreUsuario: row.nombre_usuario }
        });
        if (existingByUsername) {
            errors.push(`Nombre de usuario ${row.nombre_usuario} ya existe en el sistema`);
        }

        // Validar área existe
        const area = await Area.findOne({ where: { codigo: row.area_codigo } });
        if (!area) {
            errors.push(`Área con código "${row.area_codigo}" no existe`);
        }

        // Validar roles existen
        const rolesCodigos = String(row.roles).split(';').map((r: string) => r.trim()).filter(r => r);
        for (const codigo of rolesCodigos) {
            const rol = await Rol.findOne({ where: { clave: codigo } });
            if (!rol) {
                errors.push(`Rol "${codigo}" no existe`);
            }
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Import users from parsed data
     */
    static async importUsers(rows: any[]): Promise<ImportResult> {
        const results: RowResult[] = [];
        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // +2 porque Excel empieza en 1 y tiene header

            try {
                // Validar fila
                const validation = await this.validateRow(row, rowNumber);

                if (!validation.valid) {
                    results.push({
                        row: rowNumber,
                        status: 'error',
                        error: validation.errors.join(', ')
                    });
                    failedCount++;
                    continue;
                }

                // Obtener área
                const area = await Area.findOne({ where: { codigo: row.area_codigo } });
                if (!area) {
                    throw new Error(`Área ${row.area_codigo} no encontrada`);
                }

                // Obtener roles
                const rolesCodigos = String(row.roles).split(';').map((r: string) => r.trim()).filter(r => r);
                const roles = await Rol.findAll({
                    where: { clave: rolesCodigos }
                });

                if (roles.length === 0) {
                    throw new Error('No se encontraron roles válidos');
                }

                // Hash password
                const saltRounds = 10;
                const contrasenaHash = await bcrypt.hash(row.contrasena, saltRounds);

                // Crear usuario
                const usuario = await Usuario.create({
                    documento: parseInt(String(row.documento)),
                    nombre: String(row.nombre).trim(),
                    segundoNombre: row.segundo_nombre ? String(row.segundo_nombre).trim() : undefined,
                    primerApellido: String(row.primer_apellido).trim(),
                    segundoApellido: row.segundo_apellido ? String(row.segundo_apellido).trim() : undefined,
                    correoElectronico: row.correo_electronico,
                    nombreUsuario: row.nombre_usuario,
                    contrasenaHash,
                    areaId: area.id,
                    activo: row.activo !== undefined ? String(row.activo).toLowerCase() === 'true' : true
                });

                // Asignar roles
                const usuarioRolesData = roles.map((rol: any) => ({
                    usuarioId: usuario.id,
                    rolId: rol.id
                }));
                await UsuarioRol.bulkCreate(usuarioRolesData);

                results.push({
                    row: rowNumber,
                    status: 'success',
                    data: {
                        id: usuario.id,
                        nombreUsuario: usuario.nombreUsuario,
                        correoElectronico: usuario.correoElectronico
                    }
                });
                successCount++;

            } catch (error: any) {
                console.error(`Error en fila ${rowNumber}:`, error);
                results.push({
                    row: rowNumber,
                    status: 'error',
                    error: error.message || 'Error desconocido al crear usuario'
                });
                failedCount++;
            }
        }

        return {
            success: failedCount === 0,
            summary: {
                total: rows.length,
                success: successCount,
                failed: failedCount
            },
            results
        };
    }
}
