declare module "localstory" {
  type LSOptions = {
    ttl?: string | number;
    vacuum?: boolean;
  };

  type LSStore<T> = {
    get: (key: keyof T) => T[keyof T];
    set: <K extends keyof T>(key: K, value: T[K], options?: LSOptions) => void;
    unset: (key: keyof T) => void;
    has: (key: keyof T) => boolean;
    clear: () => void;
    vacuum: () => void;
    keys: () => (keyof T)[];
    values: () => T[keyof T][];
  };

  function createStore<T extends object = Record<string, unknown>>(store: T, ns?: string, options?: LSOptions): LSStore<T>;
  export default createStore;
}
