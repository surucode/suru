import { Task, SuruBit } from "..";
import { TaskBuilder } from "./TaskBuilder";

import { __tasks, __current_task, __package, __bits } from "../private";
import { SuruRuntimeError } from "./SuruRuntimeError";
import chalk from "chalk";

import "../bits/register";
import { utils } from "./dsl";

const debug = require("debug")("suru:core");

export type SuruPackageFunctionOptions = { [key: string]: any };
export type SuruPackageFunction = (opts?: SuruPackageFunctionOptions) => void;

export type TaskGenerator = (dsl: DSL) => void;

class Suru {
  private [__tasks]: { [name: string]: Task } = {};
  private [__package] = "::";
  private [__bits]: { [name: string]: SuruBit } = {};

  public getTask(taskName: string): Task {
    return this[__tasks][taskName];
  }

  public getTasks(): Task[] {
    return Object.values(this[__tasks]);
  }

  public task(taskGenerator: TaskGenerator): Task {
    return TaskBuilder.call(this, taskGenerator);
  }

  public runTask(task: Task, ...args: any[]) {
    this.run_in_package(task.package, () => {
      this.dsl(task).chdir(global.__project || process.cwd(), () => {
        const oldTask = global.__task;
        try {
          global.__task = task;
          task.runFns.forEach(fn => fn.call(task, ...args));
        } catch (err) {
          debug("Error thrown running task : ");
          debug(task);
          debug(err);
          if (err instanceof SuruRuntimeError) {
            console.error(chalk.red(err.message));
          } else {
            throw err;
          }
        } finally {
          global.__task = oldTask;
        }
      });
    });
  }

  public package(pkg_name: string, pkg: () => void) {
    this.run_in_package(`${this[__package]}${pkg_name}`, pkg);

    return this;
  }

  public bit(bit: SuruBit) {
    this[__bits][bit.dsl] = bit;

    return this;
  }

  private run_in_package(pkg_name: string, run: () => void) {
    const pkg_before = this[__package];
    this[__package] = `${pkg_name.replace(/:$/, "")}:`;
    run();
    this[__package] = pkg_before;
  }

  private dsl(task: Task): DSL {
    const dsl: any = { ...utils };

    Object.keys(this[__bits]).forEach(k => {
      dsl[k] = this[__bits][k](task);
    });

    return <DSL>dsl;
  }

  static register(): Suru {
    if (!("__suru" in global)) {
      const suru = new Suru();

      Object.defineProperty(global, "suru", { get: () => suru });
    }

    return global.__suru;
  }
}

export default Suru.register();

declare global {
  namespace NodeJS {
    export interface Global {
      __suru: Suru;
      __task: Task;
    }
  }
}
