import { SpawnSyncOptionsWithStringEncoding } from "child_process";

export type ShellBitRunArgs = Symbol;
export const ShellBitRunArgsPosition: ShellBitRunArgs = Symbol(
  "ShellBitRunArgs"
);
export type ShellBitArgs = Array<
  string | Symbol | SpawnSyncOptionsWithStringEncoding
>;

export const addRunArgs = (args: ShellBitArgs, runArgs: any[]) => {
  const shell_args_pos = args.indexOf(ShellBitRunArgsPosition);
  return shell_args_pos >= 0
    ? [
        ...args.slice(0, shell_args_pos),
        ...runArgs,
        ...args.slice(shell_args_pos + 1)
      ]
    : args;
};

export const extractOptions = (args: ShellBitArgs) => {
  const options = (() => {
    const opts = args.slice(-1);
    return opts.length ? opts[0] : {};
  })();
  const has_opts =
    options && typeof options === "object" && !Array.isArray(options);
  const args_without_opts = has_opts ? args.slice(0, -1) : args;

  return {
    options,
    args_without_opts
  };
};
