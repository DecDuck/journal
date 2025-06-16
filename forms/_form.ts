import type { ArkErrors } from "arktype";

type MinArktype<V> = ((object: unknown) => ArkErrors | V) & {
  infer: V;
  // Assumes we configure throwing arktype
  configure: (configuration: object) => (object: unknown) => V;
};

export function Forminator<V>(
  validator: MinArktype<V>,
  descriptions: {
    [key in keyof V]: ForminatorMetadata;
  }
): ForminatorResult<V> {
  return {
    validator,
    descriptions: Object.entries(descriptions),
  };
}

type ForminatorMetadata = {
  name: string;
  type?: string;
  placeholder?: string;
  description?: string;
};

export type ForminatorResult<V> = {
  validator: MinArktype<V>;
  descriptions: Array<[string, ForminatorMetadata]>;
};
