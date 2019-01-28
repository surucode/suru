import { ShellBitRunArgs } from "./utils";

export { ShellBit } from "./bit/ShellBit";
export { ShellBitArgs } from "./utils";

type ShellBitFun = (program: string, ...args: Array<string | Symbol>) => void;
interface ShellBit extends ShellBitFun {
  args: ShellBitRunArgs;
}

declare global {
  namespace NodeJS {
    export interface Global {
      shell: ShellBit;
    }
  }
}
