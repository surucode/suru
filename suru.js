const { task } = require("@surucode/suru");

const fs = require("fs");

task(({ name, desc, shell }) => {
  name("build");
  desc("build suru with suru");

  shell("npm", "install");
  shell("npx", "tsc", "-d");

  run(() => {
    const package_json = fs.readFileSync(__project + "/package.json", {
      encoding: "utf-8",
      flag: "r"
    });
    const package = JSON.parse(package_json);
    package.main = "index.js";
    package.types = "index.d.ts";

    delete package.devDependencies;
    delete package.scripts;

    package.bin = {
      suru: "./cli/index.js"
    };

    fs.writeFileSync(
      __project + "/dist/package.json",
      JSON.stringify(package, null, 3)
    );

    try {
      fs.unlinkSync(__project + "/dist/package-lock.json");
    } catch (err) {
      if (!(err.message && /^ENOENT/.test(err.message))) {
        throw err;
      }
    }

    fs.writeFileSync(
      __project + "/dist/cli/index.js",
      [
        "#!/usr/bin/env node",
        fs.readFileSync(__project + "/dist/cli/index.js", {
          encoding: "utf-8",
          flag: "r"
        })
      ].join("\n")
    );
  });
});

task(({ name, desc, run, chdir }) => {
  name("publish");
  desc("publish suru");

  run(() => {
    invoke("build");
  });

  try {
    fs.mkdirSync("./dist");
  } catch (err) {
    if (err.code != "EEXIST") throw err;
  }

  chdir("./dist", () => {
    shell("npm", "publish", "--access", "public");
  });
});

task(({ name, desc, shell }) => {
  name("test");
  desc("test with jest");

  shell("npm", "t", "--", "--watch");
});
