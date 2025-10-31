import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface TicketAttributes {
  id: string;
  instanciaId?: string;
  creadoPor: string;
  AsignadoA?: string;
  estado?: string;
  descripcion?: string;
  solucion?: string;
  creadoEn?: Date;
  resueltoEn?: Date;
}

interface TicketCreationAttributes
  extends Optional<
    TicketAttributes,
    | "id"
    | "instanciaId"
    | "AsignadoA"
    | "estado"
    | "descripcion"
    | "solucion"
    | "creadoEn"
    | "resueltoEn"
  > {}

class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: string;
  public instanciaId?: string;
  public creadoPor!: string;
  public AsignadoA?: string;
  public estado?: string;
  public descripcion?: string;
  public solucion?: string;
  public creadoEn?: Date;
  public resueltoEn?: Date;

  public static initModel(sequelize: Sequelize): typeof Ticket {
    return Ticket.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        instanciaId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "instancia_id",
        },
        creadoPor: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "creado_por",
        },
        AsignadoA: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "asignado_a",
        },
        estado: {
          type: DataTypes.STRING(50),
          defaultValue: "abierto",
          allowNull: true,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        solucion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        creadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
        resueltoEn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "resuelto_en",
        },
      },
      {
        sequelize,
        tableName: "tickets",
        modelName: "Ticket",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    this.belongsTo(models.InstanciaProceso, {
      foreignKey: "instanciaId",
      as: "instancia",
    });
    this.belongsTo(models.Usuario, {
      foreignKey: "creadoPor",
      as: "creador",
    });
    this.belongsTo(models.Usuario, {
      foreignKey: "AsignadoA",
      as: "asignadoAUsuario",
    });
  }
}

export default Ticket;
