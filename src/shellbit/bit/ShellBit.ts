import { SuruBit, Task } from "../../core";
import { spawnSync, StdioOptions, SpawnSyncReturns } from "child_process";
import {
  extractOptions,
  addRunArgs,
  ShellBitArgs,
  ShellBitRunArgsPosition
} from "../utils";
import { cwd } from "process";

const debug = require("debug")("suru:shellbit");

type ExecFn = (
  program: string,
  ...args: ShellBitArgs
) => SpawnSyncReturns<Buffer>;
type RuntimeShellBitFn = (exec: ExecFn, ...runArgs: any[]) => void;

export const ShellBit: SuruBit = (
  program: string | RuntimeShellBitFn,
  ...args: ShellBitArgs
) => (t: Task) => {
  const default_opts = {
    cwd: cwd(),
    stdio: <StdioOptions>"inherit"
  };

  t.runFns.push((...runArgs: any[]) => {
    const executor = (program: string, ...args: ShellBitArgs) => {
      const { options, args_without_opts } = extractOptions(args);
      const realRunArgs =
        Array.isArray(runArgs) &&
        runArgs.length &&
        typeof runArgs[0] === "object" &&
        Array.isArray((<any>runArgs[0]).__args)
          ? (<any>runArgs[0]).__args
          : runArgs;

      const args_with_run_args = addRunArgs(args_without_opts, realRunArgs);

      debug("spawning", program, args_with_run_args, {
        ...default_opts,
        ...options
      });

      return spawnSync(program, args_with_run_args, {
        ...default_opts,
        ...options
      });
    };
    executor.args = ShellBitRunArgsPosition;

    if (typeof program === "function") {
      program(executor, ...runArgs);
    } else {
      executor(program, ...args);
    }
  });
};
