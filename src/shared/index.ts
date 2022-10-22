export const extend = Object.assign


export const isObject = (val: any) => {
  return val !== null && typeof val === 'object'
}


export const hasChanged = (val: any, newVal: any) => !Object.is(val, newVal)
export const hasOwn = (val: any, key: any) => Object.prototype.hasOwnProperty.call(val, key)
const camelizeRE = /-(\w)/g;
/**
 * @private
 * 把烤肉串命名方式转换成驼峰命名方式
 */
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export const toHandlerKey = (str: string) =>
  str ? `on${capitalize(str)}` : ``;


export const EMPTY_OBJ = {}

export const isString = (value) => typeof value === "string"
