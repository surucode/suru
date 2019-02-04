import { SuruBit, Task } from "../core";
import { ArgumentParser, ArgumentOptions } from "argparse";

interface TaskWithArgs extends Task {
  argParser: ArgumentParser;

  runWithoutParsing: typeof Task.prototype.run;
  run: (...args: any[]) => void;
}

const ArgBit: SuruBit = (t: TaskWithArgs) => (
  arg: string | string[],
  opts: ArgumentOptions
) => {
  if (!t.argParser) {
    if (!t.name || typeof t.name !== "string" || t.name.trim().length < 1) {
      throw new Error("Task should have a name before calling ArgBit!");
    }

    t.argParser = new ArgumentParser({
      prog: `suru ${t.name}`,
      description: t.desc
    });

    t.runWithoutParsing = t.run.bind(t);
    t.run = (...args: any[]) => {
      if (args.length === 1 && typeof args[0] === "object") {
        t.runWithoutParsing(args[0]);
      } else {
        const parsedArgs = t.argParser.parseArgs(args);
        parsedArgs.__args = args;
        t.runWithoutParsing(parsedArgs);
      }
    };
  }

  t.argParser.addArgument(arg, opts);
};

ArgBit.dsl = "arg";

export default ArgBit;
