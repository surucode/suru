import { Task } from ".";

export const __current_task = Symbol("__current_task");
export const __tasks = Symbol("__tasks");
export const __package = Symbol("__package");

declare global {
  export interface Suru {
    [__current_task]: Task;
    [__tasks]: { [name: string]: Task };
    [__package]: string;
  }
}
