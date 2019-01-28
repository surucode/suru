const fs = require("fs");

task(() => {
  name("build");
  desc("build suru with suru");

  shell("npx", "tsc", "-d");

  run(() => {
    const package_json = fs.readFileSync(__dirname + "/package.json", {
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
      __dirname + "/dist/package.json",
      JSON.stringify(package, null, 3)
    );

    try {
      fs.unlinkSync(__dirname + "/dist/package-lock.json");
    } catch (err) {
      if (!(err.message && /^ENOENT/.test(err.message))) {
        throw err;
      }
    }
  });
});

task(() => {
  name("publish");
  desc("publish suru");

  shell("npm", "install");

  run(() => {
    invoke("build")();
  });

  chdir("./dist", () => {
    shell("npm", "publish", "--access", "public");
  });
});

task(() => {
  name("test");
  desc("test with jest");

  shell("npm", "t", "--", "--watch");
});
