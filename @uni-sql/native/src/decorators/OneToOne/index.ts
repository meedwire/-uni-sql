import { IField } from "../../types";

type Entity<T> = () => new(...args: any[]) => T;
type InverseSide<T> = (entity: T) => any
interface IOptions{
  cascade: boolean
}

export function OneToOne<T>(typeFunctionOrTarget: Entity<T>, inverseSide?: InverseSide<T>, options?: IOptions) {
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

      const type = 'integer'

      //@ts-ignore
      const Class = new typeFunctionOrTarget()

      //@ts-ignore
      const relations = `${propertyKey}Id not null constraint user references ${new Class().tableName} ${options?.cascade ? 'on delete cascade' : ''}`
  
      Reflect.defineMetadata(propertyKey, { fieldName: propertyKey, type, relations }, target);
    };
  }
  