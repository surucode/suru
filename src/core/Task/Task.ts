import { __package } from "../private";
import { Suru } from "..";

export class Task {
  public name?: string;
  public desc?: string;
  public package: string = "::";
  public runFns: [(...args: any[]) => any] = [() => {}];

  public run(...args: any[]) {
    console.log("RUNNING");
    console.log(new Error().stack);
    console.log(this.runFns);
    Suru.register().run_in_package(this.package, () => {
      this.runFns.forEach(fn => fn.call(this, ...args));
    });
  }
}
