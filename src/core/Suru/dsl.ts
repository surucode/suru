import { resolve } from "path";
import { SuruRuntimeError } from "./SuruRuntimeError";
import { DEFAULT_PACKAGE } from "../private";
import { Task } from "..";

const debug = require("debug")("suru:core:utils");

const chdir = (dir: string, fn: Function): void => {
  const oldPwd = process.cwd();
  debug(`chdir from ${oldPwd} to ${dir}`);
  debug(`chdir to ${resolve(oldPwd, dir)}`);
  process.chdir(resolve(oldPwd, dir));
  fn();
  process.chdir(oldPwd);
};

const fatal = (message: string): void => {
  throw new SuruRuntimeError(`Fatal: ${message}`);
};

const invoke = (taskName: string, ...args: any): void => {
  const unscoped = taskName.match(/^::/);

  const current_package =
    (global.__task && global.__task.package) || DEFAULT_PACKAGE;
  const final_name = unscoped ? taskName : `${current_package}${taskName}`;

  const task = global.__suru.getTask(final_name);

  if (!(task instanceof Task)) {
    if (current_package !== DEFAULT_PACKAGE) {
      // try parent package before throwing
      const parent_pkg = current_package.replace(
        /(^::)((?:[^:]+:)*)([^:]+:)+$/,
        "\1\2"
      );

      debug(`failed to invoke ${final_name} trying ${parent_pkg}${taskName}`);

      return invoke(`${parent_pkg}${taskName}`, ...args);
    }
    throw new Error(
      `Cannot invoke task ! ${JSON.stringify(taskName, null, 3)}`
    );
  }

  return global.__suru.runTask(task, ...args);
};

export const utils = {
  chdir,
  fatal,
  invoke
};

declare global {
  export interface DSL {
    chdir: typeof chdir;
    fatal: typeof fatal;
    invoke: typeof invoke;
  }
}
