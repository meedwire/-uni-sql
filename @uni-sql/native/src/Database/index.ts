import * as SQLite from "expo-sqlite";
import { User } from "../../../../src/database/Entity";
import { SQL } from "./helpers";
import { IDatabase, IOptions, ISyncConfig } from "./types";

export class Database<
  T extends { [K: string]: Function },
  K extends keyof T
> extends SQL {
  private name: string;
  private version?: string;
  private description?: string;
  private size?: number;
  private tableName!: string;
  public entities: T;
  //@ts-ignore
  private changesCallback: { [k in keyof T]: (data: any) => void } = {};
  private syncConfig?: ISyncConfig<T>;

  private db!: IDatabase<T>;
  private timerChanges?: NodeJS.Timer = undefined;

  constructor(options: IOptions<T>) {
    super();
    this.name = options.name;
    this.size = options?.size;
    this.version = options?.version;
    this.entities = options.entities;
    this.description = options?.description;
    this.syncConfig = options?.syncConfig;
  }

  create() {
    return new Promise<IDatabase<T>>((resolve, reject) => {
      if (this.db) return resolve(this.db);

      SQLite.openDatabase(
        this.name,
        this.version,
        this.description,
        this.size,
        (db) => {
          this.localDb = db;

          this.db = {
            entity: this.entity.bind(this) as any,
            sql: this.sql.bind(this),
          };

          const tableNames = Object.values(this.entities).map((entity) => {
            //@ts-ignore
            const table = new entity();

            return `create table if not exists ${table.tableName}(
                ${table.sqlCreate}\n)`;
          });

          db.transaction(
            (tx) => {
              //Object.values(this.entities).forEach((table) => tx.executeSql(`drop table if exists ${new table().tableName}`));
              tableNames.forEach((table) => tx.executeSql(table));
            },
            (err) => {
              reject(err);
            },
            () => resolve(this.db)
          );
        }
      );
    });
  }

  public async sql(query: string) {
    return this.query(query);
  }

  private async dropAllData() {
    const sql = `delete from ${this.tableName};`;

    await this.query(sql);
  }

  private async insert(data: any) {
    //@ts-ignore
    const newRow = new this.entities[this.tableName]().create(data);

    await this.query(newRow.sql);

    if (typeof this.changesCallback?.[this.tableName] === "function") {
      if (this.timerChanges) clearTimeout(this.timerChanges);

      this.timerChanges = setTimeout(async () => {
        const response = await this.select(["*"]);
        this.changesCallback[this.tableName](response);
      }, 200);
    }
  }

  private async select(fields: any) {
    const sql = `select ${fields.join(",")} from ${this.tableName};`;
    const { result } = await this.query(sql);

    let data = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      data.push(result.rows.item(i));
    }

    return data;
  }

  private removeChages() {
    //@ts-ignore
    delete this.changesCallback?.[this.entity];
  }

  public changes(entity: keyof T, callback: (data: any) => void) {
    this.changesCallback[entity] = callback;

    return {
      remove: this.removeChages.bind(entity),
    };
  }

  private delete(id: number) {}

  private entity(name: string) {
    this.tableName = name;

    return {
      select: this.select.bind(this),
      dropAllData: this.dropAllData.bind(this),
      insert: this.insert.bind(this),
    };
  }

  private sync(config: any) {
    const socket = io("http://192.168.86.26:3000").connect();

    this.socket = socket;

    socket.on("connection", () => {
      console.log("client connected");
    });

    Object.keys(config).map((key) => {
      const lastSynchronization = "";

      socket.emit(`sync/${key}`, { tableName: key, lastSynchronization });

      socket.on(`sync/${key}`, (data: IData) => {
        console.log(data);
        this.tableName = data.tableName;
        data.data.forEach((row) => {
          this.insert(row);
        });
      });
    });
  }
}
