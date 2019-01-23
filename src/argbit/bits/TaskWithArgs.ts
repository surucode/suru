import { ArgumentParser } from "argparse";
import { Task } from "../../core";

export interface TaskWithArgs extends Task {
  argParser: ArgumentParser;

  runWithoutParsing: (...args: string[]) => any;
  run: (...args: [{ [name: string]: any }]) => any;
}
