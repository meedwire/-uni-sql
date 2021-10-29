import { IField } from "../../types";

export function Field<T extends boolean>({ fieldName, type, primaryKey }: IField<T>) {
  return function (target: Object, propertyKey: string) {
    let value: string;

    const getter = function () {
      return value;
    };

    const setter = function (newVal: string) {
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });

    Reflect.defineMetadata(fieldName, { fieldName, type, primaryKey }, target);
  };
}
