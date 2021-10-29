export interface ISyncConfig<T>{
  host: string;
  /**
   * default is 33050
   */
  port?: number;
  entities: {
    [K in keyof T]: string
  }
}


export interface IOptions<T> {
  name: string;
  version?: string;
  description?: string;
  size?: number;
  entities: T;
  syncConfig?: ISyncConfig<T>
}

export interface IOptionsSelect {
  only: {
    id: string | number;
  };
}

export type ExcludeNative<T> = Omit<T, "create" | "sqlCreate" | "fields">;

export type IDataInsert<T extends Function> = {
  [K in keyof ExcludeNative<T["prototype"]>]: T["prototype"][K];
};

export type IInsert<T extends Function> = (
  data: IDataInsert<T>
) => Promise<boolean>;

export type IFielsSelect<K> = K[] | "*"[]

export type ISelect<T extends Function> = () => void;

export interface IDBMethodts<T extends Function> {
  select: <K extends keyof ExcludeNative<T['prototype']>>(
    fields: IFielsSelect<K>,
    options?: IOptionsSelect
  ) => Promise<
    typeof fields[number] extends "*"
      ? {}
      : { [P in Exclude<typeof fields[number], "*">]: T["prototype"][P] }[]
  >;
  dropAllData: () => Promise<boolean>;
  only: (id: string) => {
    selelct: IDBMethodts<T>["select"];
  };
  insert: IInsert<T>;
}

export interface IDatabase<T extends { [K: string]: Function }> {
  entity: <P extends keyof T>(name: P) => IDBMethodts<T[P]>;
  sql: (query: string) => Promise<any>;
}

