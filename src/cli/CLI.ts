import { Suru } from "../core";
import { findSuruFile } from "./findSuruFile";
import { SuruArgsParser } from "./SuruArgsParser";

export function CLI() {
  // register Suru
  require("../shellbit/register");
  require("../argbit/register");

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
  argParser.tasks = global.__suru.getTasks();

  const { task } = argParser.parseArgs(process.argv.slice(2, 3));
  const rTask = global.__suru.getTask(`::${task}`);

  if (rTask) {
    rTask.run(...process.argv.slice(3));
  } else {
    argParser.error(`Task ${task} could not be found!`);
  }
}
