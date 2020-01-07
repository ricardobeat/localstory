declare module "localstory" {
  type LSOptions = {
    ttl?: string | number;
    vacuum?: boolean;
  };

  type LSStore = {
    get: (key: string) => any;
    set: (key: string, value: any, options?: LSOptions) => void;
    unset: (key: string) => void;
    has: (key: string) => boolean;
    clear: () => void;
    vacuum: () => void;
    keys: () => [string];
    values: () => [any];
  };

  export default function(
    store: any,
    ns?: string,
    options?: LSOptions
  ): LSStore;
}
