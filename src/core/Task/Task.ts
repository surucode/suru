import { __package } from "../private";
import { Suru } from "..";

export class Task {
  public name?: string;
  public desc?: string;
  public package: string = "::";
  public runFns: [(...args: any[]) => any] = [() => {}];

  public run(...args: any[]) {
    Suru.register().runTask(this, ...args);
  }
}
