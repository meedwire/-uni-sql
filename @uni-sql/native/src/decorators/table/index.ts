type Constructable<T> = new(...args: any[]) => T;

export function TableName<T extends Constructable<any>>(tableName: string) {
  return function (target: T): T {
    return class extends target {
      public tableName: string = tableName;
    }
  };
}
