import { SuruBit, Task } from "../../core";
import { ArgumentOptions } from "argparse";
import { TaskWithArgs } from "./TaskWithArgs";

const RawArgsBit: SuruBit = (arg: string | string[], opts: ArgumentOptions) => (
  t: TaskWithArgs
) => {
  if (!t.argParser) {
    throw new Error("Task should have ArgBits before calling RawArgsBit!");
  }

  (<Task>t).run = t.runWithoutParsing;
  delete t.argParser;
};

export { RawArgsBit };
