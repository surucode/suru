import { realpathSync, existsSync, readFileSync } from "fs";
import { cwd } from "process";
import { resolve, dirname } from "path";

const debug = require("debug")("suru:cli:find_suru_file");

export const findSuruFile = () => {
  const surufile = (() => {
    let dir = cwd();

    while (true) {
      const surufile = resolve(dir, "./suru.js");
      debug(`resolving ${surufile}`);

      if (existsSync(surufile)) {
        return surufile;
      }

      const packagejson = resolve(dir, "./package.json");
      debug(`resolving ${packagejson}`);
      if (existsSync(packagejson)) {
        debug(`reading file ${packagejson}`);
        const pkg = JSON.parse(
          readFileSync(packagejson, { encoding: "utf-8" })
        );
        if (pkg.surufile) {
          debug(`package.json has surufile : ${pkg.surufile}`);
          const pkg_surufile = resolve(dir, pkg.surufile);
          debug(`resolving surufile : ${pkg_surufile}`);
          if (existsSync(pkg_surufile)) {
            debug(`loaded : ${pkg_surufile}`);
            return pkg_surufile;
          }
        }
      }

      if (dir === "/") break;
      dir = resolve(dir, "..");
    }
    return null;
  })();

  Object.defineProperties(global, {
    __surufile: { get: () => surufile },
    __project: { get: () => surufile && dirname(surufile) }
  });
};

declare global {
  namespace NodeJS {
    export interface Global {
      __surufile: string;
      __project: string;
    }
  }
}
