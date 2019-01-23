export { ArgBit } from "./bits/ArgBit";
export { RawArgsBit } from "./bits/RawArgsBit";

declare global {
  namespace NodeJS {
    export interface Global {
      arg(arg: string | string[], opts: Object): void;
      raw_args(): void;
    }
  }
}
