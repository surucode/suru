import chalk from "chalk";
import { format } from "util";
import { ArgumentParser } from "argparse";
import { Task } from "../core";

const Action = require("argparse/lib/action");

export class SuruArgsParser extends ArgumentParser {
  private debug: boolean;
  private usage: string;
  private prog: string;
  private description: string;
  private epilog: string;

  public tasks: Task[] = [];

  _getFormatter: () => any;
  _actions: any;
  _actionGroups: [
    {
      title: string;
      description: string;
      _groupActions: [any];
      _container: SuruArgsParser;
    }
  ];
  _mutuallyExclusiveGroups: any;
  _positionals: any;

  formatHelp() {
    var formatter = this._getFormatter();

    // usage
    formatter.addUsage(
      this.usage,
      this._actions,
      this._mutuallyExclusiveGroups
    );

    // description
    formatter.addText(this.description);

    formatter.startSection("Available tasks");
    formatter.addArguments(
      this.tasks.map((t: Task) => new Action({ dest: t.name, help: t.desc }))
    );
    formatter.endSection();

    // positionals, optionals and user-defined groups
    this._actionGroups.forEach(function(actionGroup) {
      // Skip positionals
      if (actionGroup === actionGroup._container._positionals) return;

      formatter.startSection(actionGroup.title);
      formatter.addText(actionGroup.description);
      formatter.addArguments(actionGroup._groupActions);
      formatter.endSection();
    });

    // epilog
    formatter.addText(this.epilog);

    // determine help from format above
    return formatter.formatHelp();
  }

  error(err: Error | string) {
    var message;
    if (err instanceof Error) {
      if (this.debug === true) {
        throw err;
      }
      message = err.message;
    } else {
      message = err;
    }
    var msg = format("%s: error: %s", this.prog, message) + "\n";

    if (this.debug === true) {
      throw new Error(msg);
    }

    this.printHelp();

    return this.exit(2, chalk.red(`\n${msg}`));
  }
}
