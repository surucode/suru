import callsites from "callsites";
import { dirname } from "path";
import { SuruPackageFunction } from "../Suru/Suru";

const debug = require("debug")("suru:core:require");

const core_src = dirname(__dirname);

const require_from_dir = (name: string, path: string) => {
  try {
    const file = require.resolve(name, { paths: [path] });
    debug(`Requiring ${file}`);
    return require(file) || true;
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      debug("could not require ", name, "from", path);
      return false;
    }
    throw err;
  }
};

const _caller_dir = () => {
  for (const callsite of callsites()) {
    const hasReceiver =
      callsite.getTypeName() !== null && callsite.getFileName() !== null;
    if (hasReceiver) {
      const filename = callsite.getFileName();
      // ignore ourself
      debug(`testing ${filename}`);
      if (!filename.includes(core_src) && !filename.startsWith("internal/")) {
        debug(`returning ${dirname(filename)}`);
        return dirname(filename);
      } else {
        debug(`${filename} includes ${core_src} (or internal/)`);
      }
    }
  }
};

export const require_bit = (bit: string) => {
  const origin_dir = _caller_dir();

  if (
    !(
      require_from_dir(`@surucode/suru-${bit}/register`, origin_dir) ||
      require_from_dir(`${bit}/register`, origin_dir) ||
      require_from_dir(bit, origin_dir)
    )
  ) {
    throw new Error(
      `Could not require bit '${bit}' from context: ${origin_dir}`
    );
  }
};

type require_pkg = (pkg_name: string) => SuruPackageFunction;
export const require_pkg: require_pkg = (pkg_name: string) => {
  const origin_dir = _caller_dir();

  const pkg =
    require_from_dir(`@surucode/suru-${pkg_name}`, origin_dir) ||
    require_from_dir(`${pkg_name}`, origin_dir);

  if (!pkg) {
    throw new Error(
      `Could not require package '${pkg_name}' from context: ${origin_dir}`
    );
  }

  return pkg;
};
