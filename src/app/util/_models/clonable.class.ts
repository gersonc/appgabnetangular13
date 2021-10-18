export class ClonableClass {
  public static deepCopy<T>(source: T): any[] | Date | string | T {
    return Array.isArray(source)
      ? source.map(item => this.deepCopy(item))
      : source instanceof Date
        ? new Date(source.getTime())
        : source && typeof source === 'object'
          ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
            // @ts-ignore
            Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop));
            // @ts-ignore
            o[prop] = this.deepCopy(source[prop]);
            return o;
          }, Object.create(Object.getPrototypeOf(source)))
          : source as T;
  }
}
