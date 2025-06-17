import type { ArkErrors } from "arktype";

type MinArktype<V> = ((object: unknown) => ArkErrors | V) & {
  infer: V;
  // Assumes we configure throwing arktype
  configure: (configuration: object) => (object: unknown) => V;
};

export function Forminator<V>(
  validator: MinArktype<V>,
  descriptions: {
    [key in keyof V]: ForminatorMetadata<V[key]>;
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
  default?: T
};

export type ForminatorResult<V> = {
  validator: MinArktype<V>;
  descriptions: Array<[string, ForminatorMetadata<unknown>]>;
};
