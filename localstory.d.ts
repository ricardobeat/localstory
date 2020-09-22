declare module "localstory" {
  type LSOptions = {
    ttl?: string | number;
    vacuum?: boolean;
  };

  type LSStore<T> = {
    get: (key: keyof T) => T[keyof T];
    set: (key: keyof T, value: unknown, options?: LSOptions) => void;
    unset: (key: keyof T) => void;
    has: (key: keyof T) => boolean;
    clear: () => void;
    vacuum: () => void;
    keys: () => (keyof T)[];
    values: () => (T[keyof T])[];
  };

  type LSCreateStore<T extends object = { [key: string]: unknown }> =
    (store: T, ns?: string, options?: LSOptions) => LSStore<T>;

  const createStore: LSCreateStore;
  export default createStore;
}

