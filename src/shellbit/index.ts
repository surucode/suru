export { ShellBit, ShellBitArgs } from "./bit/ShellBit";

type ShellBitArgs = Symbol;
type ShellBitFun = (program: string, ...args: Array<string | Symbol>) => void;
interface ShellBit extends ShellBitFun {
  args: ShellBitArgs;
}

declare global {
  namespace NodeJS {
    export interface Global {
      shell: ShellBit;
    }
  }
}
