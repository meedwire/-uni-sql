interface IFields {
  fieldName: string;
  type: string;
  defaultValue?: string;
  delete?: boolean;
  primaryKey: boolean | undefined;
}

export class Insert {
  private tableName = "";

  create(data: any) {
    const keys = Object.getOwnPropertyNames(this).filter(
      (key) => key !== "tableName"
    );

    const metadataTable = keys.map((key) => {
      return Reflect.getMetadata(key, this);
    });

    let newRow = {};
    let sql = "";

    metadataTable.forEach((obj: IFields) => {
      if (!obj?.delete) {
        Object.assign(newRow, { [obj.fieldName]: obj?.defaultValue });
      }

      //@ts-ignore
      if (obj.primaryKey) delete newRow[obj.fieldName];
    });

    Object.assign(newRow, data);

    sql = `insert into ${this.tableName}(${Object.keys(newRow).join(
      ", "
    )}) values(${Object.values(newRow)
      .map((field) => (typeof field === "string" ? `'${field}'` : `${field}`))
      .join(", ")});`;

    return {
      row: newRow,
      sql,
    };
  }
}
