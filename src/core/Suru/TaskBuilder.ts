import { __current_task, __tasks, __package } from "../private";
import { Suru, Task, SuruBit } from "..";

export function TaskBuilder(taskDefFn: Function) {
  const task = new Task();
  task.package = this[__package];

  const defToRemove: string[] = [];
  const previousDefs: { [name: string]: PropertyDescriptor } = {};

  // hijack definitions
  Object.keys(this.bits).forEach(name => {
    const existingDef = Object.getOwnPropertyDescriptor(global, name);
    if (existingDef) {
      previousDefs[name] = existingDef;
    } else {
      defToRemove.push(name);
    }

    Object.defineProperty(global, name, {
      get: () => this.bits[name],
      configurable: true
    });
  });

  const previousTask: Task | null = this[__current_task];
  this[__current_task] = task;

  taskDefFn();

  this[__current_task] = previousTask;

  // reset definitions
  Object.keys(previousDefs).forEach(name => {
    Object.defineProperty(global, name, previousDefs[name]);
  });
  defToRemove.forEach(name => delete (<any>global)[name]);

  if (
    !task.name ||
    typeof task.name !== "string" ||
    task.name.trim().length < 1
  ) {
    throw new Error(
      `Task name should be a non-empty string! Got: ${task.name}`
    );
  }

  if (typeof task.run !== "function") {
    throw new Error(`Task run should be a function`);
  }

  this[__tasks][`::${task.name}`] = task;

  return task.run.bind(task);
}
