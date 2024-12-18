import { MPSDK } from './types';

// PENDING: 这里补泛型
export const promisifyMPApi = <R = any>(api: (params: any) => any) => {
  return (params: Record<string, any>) => {
    return new Promise<R>((resolve, reject) => {
      api({
        ...params,
        success(res: any) {
          resolve(res);
        },
        fail(err: any) {
          reject(err);
        },
      });
    });
  };
};

export const joinQuery = (args: Record<string, unknown>) => {
  const arr: string[] = [];
  Object.entries(args).forEach(([k, v]) => {
    arr.push(`${k}=${v}`);
  });
  return arr.join('&');
};

// Some platform has no global object, we provide this function to manually create your own global object.
let customGlobal: Record<string, any> = {};
export const setCustomGlobal = (global: Record<string, any>) => {
  customGlobal = global;
};

// get the global context, and we assume the window is better than global, even in
// mini program environment, mostly because of alipay...
export const getGlobal = () => {
  let foundGlobal: Record<string, any> = {};
  if (typeof globalThis !== 'undefined') {
    foundGlobal = globalThis;
  } else if (typeof window !== 'undefined') {
    foundGlobal = window;
  } else if (typeof global === 'object' && Object.keys(global).length > 1) {
    foundGlobal = global;
  }
  if (customGlobal) {
    Object.assign(foundGlobal, customGlobal);
  }
  return foundGlobal;
};
