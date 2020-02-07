export type Method = 'get' | 'post' | 'delete' | 'put' | 'patch';

export type Tuple<T, L extends number> = [T, ...T[]] & { length: L };

export type ArrayToUnion<T extends Array<any>> = T[number];