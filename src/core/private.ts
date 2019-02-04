import { Task, SuruBit } from ".";

export const __current_task = Symbol("__current_task");
export const __tasks = Symbol("__tasks");
export const __package = Symbol("__package");
export const __bits = Symbol("__bits");

export const DEFAULT_PACKAGE = "::";

declare global {
  export interface Suru {
    [__current_task]: Task;
    [__tasks]: { [name: string]: Task };
    [__bits]: { [name: string]: SuruBit };
    [__package]: string;
  }
}
