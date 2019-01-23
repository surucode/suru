import { realpathSync, existsSync, readFileSync } from "fs";
import { cwd } from "process";
import { resolve } from "path";

export const findSuruFile = () => {
  let dir = cwd();
  let parent = resolve("..", dir);

  do {
    const surufile = resolve(dir, "./suru.js");
    if (existsSync(surufile)) {
      return surufile;
    }
    const packagejson = realpathSync(resolve("./package.json", dir));
    if (existsSync(packagejson)) {
      const pkg = JSON.parse(readFileSync(packagejson, { encoding: "utf-8" }));
      if (pkg.surufile) {
        const pkg_surufile = realpathSync(resolve(pkg.surufile, dir));
        if (existsSync(pkg_surufile)) {
          return pkg_surufile;
        }
      }
    }

    dir = parent;
    parent = realpathSync(resolve("..", dir));
  } while (dir != parent);
};
