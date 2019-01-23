import { require_bit, require_pkg } from "../Utils"
import { Task, SuruBit } from "..";
import { TaskBuilder } from "./TaskBuilder";

import { __tasks, __current_task, __package } from "../private";

export class Suru {
  private [__tasks]: { [name: string]: Task } = {};
  private [__current_task]: Task | null = null;
  private [__package] = "::";

  public bits: {
    [name: string]: ((...args: any[]) => void);
  } = {};

  public task(defTaskFn: Function): Function {
    return TaskBuilder.call(this, defTaskFn);
  }

  public getTask(taskName: string): Task {
    return this[__tasks][taskName];
  }

  public getTasks(): Task[] {
    return Object.values(this[__tasks]);
  }

  public invoke(taskName: string): Function {
    const unscoped = taskName.match(/^::/);
    const final_name = unscoped ? taskName : `${this[__package]}${taskName}`;
    const task = this.getTask(final_name);

    if (!(task instanceof Task)) {
      console.log(this[__package])
      if (this[__package] !== "::") {
        // try parent package before throwing        
        const parent_pkg = this[__package].replace(/:[^:]*$/, '') + ':'
        console.log("failed to invoke ", final_name, "trying", `${parent_pkg}${taskName}`)
        return this.invoke(`${parent_pkg}${taskName}`);
      }
      throw new Error(`Cannot invoke task ! ${JSON.stringify(taskName, null, 3)}`);
    }

    return task.run.bind(task);
  }

  public static register(): Suru {
    if (!("suru" in global)) {
      const shimasu = new Suru();

      Object.defineProperties(global, {
        suru: { get: () => shimasu },
        task: { get: () => shimasu.task.bind(shimasu) },
        package: { get: () => shimasu.package.bind(shimasu) },
        invoke: { get: () => shimasu.invoke.bind(shimasu) },
        bit: { get: () => shimasu.bit.bind(shimasu) }
      });

      require("../bits/register");
    }

    return global.suru;
  }

  public registerBit(name: string, bit: SuruBit): Suru {
    this.bits[name] = (...args: any[]) => {
      if (!(this[__current_task] instanceof Task)) {
        throw new Error(
          `Cannot call ${name}. Task bits functions can only be called when defining a task.`
        );
      }
      void bit(...args)(this[__current_task]);
    };

    return this;
  }

  public static registerBit(name: string, bit: SuruBit): Suru {
    return Suru.register().registerBit(name, bit);
  }

  public bit(bit: string): Suru {
    require_bit(bit);
    return this;
  }

  public package(pkg_name: string, pkg: (() => void) | string) {
    this.run_in_package(`${this[__package]}${pkg_name.replace(/:$/, '')}:`, () => {
      if (typeof pkg === "string") {
        require_pkg(pkg);
      } else {
        pkg();
      }
    });
  }

  public run_in_package(pkg_name: string, run: () => void) {
    const pkg_before = this[__package];
    this[__package] = `${pkg_name.replace(/:$/, '')}:`;
    run();
    this[__package] = pkg_before;
  }
}

declare global {
  namespace NodeJS {
    export interface Global {
      suru: Suru;

      bit(name: string): void;
      task(defTaskFn: Function): Function;
      package(defTaskFn: Function): void;
      invoke(taskName: string): Function;
    }
  }
}
