export function CreateDateColumn() {
  return function (target: Object, propertyKey: string) {
    let value: string = new Date().toISOString()

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

    const type = 'string'

    const defaultValue = new Date().toISOString()

    Reflect.defineMetadata(propertyKey, { fieldName: propertyKey, type, defaultValue }, target);
  };
}
