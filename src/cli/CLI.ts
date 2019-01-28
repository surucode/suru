import { Suru } from "../core";
import { findSuruFile } from "./findSuruFile";
import { SuruArgsParser } from "./SuruArgsParser";

export function CLI() {
  // register Suru
  Suru.register()
    .bit("../shellbit")
    .bit("../argbit");

  findSuruFile();

  if (global.__surufile) {
    require(global.__surufile);
  }

  const argParser = new SuruArgsParser({
    prog: `suru`,
    version: "0.0.1",
    description: "する"
  });

  argParser.addArgument("task");
  argParser.tasks = global.suru.getTasks();

  const { task } = argParser.parseArgs(process.argv.slice(2, 3));
  const rTask = global.suru.getTask(`::${task}`);

  if (rTask) {
    rTask.run(...process.argv.slice(3));
  } else {
    argParser.error(`Task ${task} could not be found!`);
  }
}
