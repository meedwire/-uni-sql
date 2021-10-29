type ITypeField = "string" | "number" | "boolean";

type ITypeFieldExtra = "integer";

export interface IField<T extends boolean> {
    fieldName: string;
    primaryKey?: T;
    type: T extends false ? ITypeField : ITypeFieldExtra
}