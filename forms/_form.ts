import type { z } from "zod/v4";
import type { $ZodObject } from "zod/v4/core";

export function Forminator<V extends $ZodObject>(
  validator: V,
  descriptions: {
    [key in keyof z.infer<V>]: ForminatorMetadata<z.infer<V>[key]>;
  }
): ForminatorResult<V> {
  return {
    validator,
    descriptions: Object.entries(descriptions),
  };
}

type ForminatorMetadata<T> = {
  name: string;
  type?: string;
  placeholder?: string;
  description?: string;
  default?: T;
  configuration?: object;
};

export type ForminatorResult<V> = {
  validator: V;
  descriptions: Array<[string, ForminatorMetadata<unknown>]>;
};
