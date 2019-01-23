import { SuruBit, Task, Suru } from "../../core";
import { cwd } from "process";
import { spawnSync } from "child_process";

type ShellBitArgs = Symbol;

export const ShellBitArgs: ShellBitArgs = Symbol("ShellBitArgs");

export const ShellBit: SuruBit = (
  program: string,
  ...args: Array<string | Symbol>
) => (t: Task) => {
  t.runFns.push((...runArgs: any[]) => {
    const shell_args_pos = args.indexOf(ShellBitArgs);

    console.log(
      shell_args_pos,
      shell_args_pos >= 0
        ? [
            ...args.slice(0, shell_args_pos),
            ...runArgs,
            ...args.slice(shell_args_pos + 1)
          ]
        : args
    );

    spawnSync(
      program,
      shell_args_pos >= 0
        ? [
            ...args.slice(0, shell_args_pos),
            ...runArgs,
            ...args.slice(shell_args_pos + 1)
          ]
        : args,
      { cwd: cwd(), stdio: "inherit" }
    );
  });
};
