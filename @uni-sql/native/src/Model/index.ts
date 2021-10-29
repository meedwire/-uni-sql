import { IField } from "../types";
import { Insert } from "./Insert";

const referTypesSQLite = {
  string: "TEXT",
  number: "NUMERIC",
  boolean: "NUMERIC",
  integer: "INTEGER"
};

interface IMetaData extends IField<any>{
  relations?: string;
  defaultValue: any
}

export abstract class Model extends Insert{
  get fields() {
    let fieldNames = Object.getOwnPropertyNames(this).filter(
      (field) => field !== "tableName",
    );

    let fieldsObjType = {}

    fieldNames.forEach((field, i) => {
      const metadata = Reflect.getMetadata(field, this) as IMetaData;

      Object.assign(fieldsObjType, {[field]: metadata.defaultValue})
    });

    return fieldsObjType
  }

  get sqlCreate(){
    let fieldNames = Object.getOwnPropertyNames(this).filter(
      (field) => field !== "tableName",
    );

    let fieldsInsert = "";

    fieldNames.forEach((field, i) => {
      const data = Reflect.getMetadata(field, this) as IMetaData;

      const type = referTypesSQLite[data.type];

      if (data.relations){
        fieldsInsert += data.relations
      }else{
        fieldsInsert += `\r\t${data.fieldName} ${data.primaryKey ? `${type} PRIMARY KEY` : type}${
          i + 1 === fieldNames.length ? "" : ",\n"
        }`;
      }
    });

    return fieldsInsert;
  }
}
