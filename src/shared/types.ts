export type Strict<T, X extends T> = T & { [K in keyof X]: K extends keyof T ? X[K] : never };

export type Callbacks<T extends object> = {
  [P in keyof T as P extends `on${string}` ? P : never]: T[P];
};

export type SetNonNullable<T extends object> = {
  [P in keyof T]: NonNullable<T[P]>;
};
