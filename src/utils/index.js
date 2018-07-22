/* @flow */

import type { PossibleValueTypes, ProxyDescriptor } from '../types';
// import { createChildDescriptor } from '../proxy';
import { PROXY_SYMBOL } from './context';

export function isType<V>(value: V): PossibleValueTypes {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';

  const type = typeof value;
  switch (type) {
    case 'object': {
      if (Array.isArray(value)) {
        return 'array';
      }
      if (value instanceof Map) {
        return 'map';
      }
      if (value instanceof Set) {
        return 'set';
      }
      if (value instanceof RegExp) {
        return 'regexp';
      }
      if (value instanceof Date) {
        return 'date';
      }
      return 'object';
    }
    case 'number': {
      if (Number.isNaN(value)) {
        return 'nan';
      }
      return 'number';
    }
    case 'symbol':
    case 'function':
    case 'boolean':
    case 'string':
    case 'undefined':
      return type;
    default: {
      console.warn('[IMMUTA]: UNKNOWN TYPE: ', value, type);
      return 'unknown';
    }
  }
}

export function shallowCopy<O: Object>(obj: O): $Shape<O> {
  if (typeof obj !== 'object' || !obj) {
    return obj;
  }

  if (obj instanceof Map) {
    return new Map(obj);
  }
  if (obj instanceof Set) {
    return new Set(obj);
  }
  if (Array.isArray(obj)) {
    return obj.slice();
  }

  const proto = Object.getPrototypeOf(obj);

  const newobj = proto ? {} : Object.create(null);

  return Object.assign(newobj, obj);
}

export function getValue<+S>(descriptor: ProxyDescriptor<S>, key?: any): S {
  if (typeof descriptor === 'function') {
    return descriptor;
  }
  const base = hasProperty(descriptor, 'copy') ? descriptor.copy : descriptor.base;
  if (key) {
    return Reflect.get(base, key);
  }
  return base;
}

export function getProxiedValue(proxy) {
  const descriptor = proxy[PROXY_SYMBOL];
  return getValue(descriptor);
}

export function is(obj, key, value2) {
  let value;
  if (obj instanceof Map) {
    value = obj.get(key);
  } else if (obj instanceof Set) {
    if (obj.has(key) && key === value2) {
      return true;
    }
    return false;
  } else if (typeof obj === 'object') {
    value = obj[key];
  }
  return Object.is(value, value2);
}

export function hasProperty<+O: Object>(obj: O, prop: any): boolean {
  if (obj instanceof Map || obj instanceof Set) {
    return obj.has(prop);
  }
  return Object.hasOwnProperty.call(obj, prop);
}

export function isCustomInspect(key) {
  return Object.is(String(Symbol.prototype.valueOf.call(key)), 'Symbol(util.inspect.custom)');
}

export function revokeProxies<+S>(descriptor: ProxyDescriptor<S>): void {
  if (descriptor.root.revokes.size) {
    descriptor.root.revokes.forEach(revoke => revoke());
  }
  descriptor.root.revoked = true;
  descriptor.root.revokes.clear();
}
