import { SuruBit, Task } from "../../core";
import { spawnSync } from "child_process";
import { extractOptions, addRunArgs, ShellBitArgs } from "../utils";
import { cwd } from "process";

export const ShellBit: SuruBit = (program: string, ...args: ShellBitArgs) => (
  t: Task
) => {
  const dir = cwd();
  t.runFns.push((...runArgs: any[]) => {
    const { options, args_without_opts } = extractOptions(args);
    const args_with_run_args = addRunArgs(args_without_opts, runArgs);

    spawnSync(program, args_with_run_args, {
      cwd: dir,
      stdio: "inherit",
      ...options
    });
  });
};
