import callsites from "callsites";
import { dirname } from "path";

const core_src = dirname(__dirname);

const require_from_dir = (name: string, path: string) => {
  try {
    require(require.resolve(name, { paths: [path] }));
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.debug("could not require ", name, "from", path);
      return false;
    }
  }

  return true;
};

const _caller_dir = () => {
  for (const callsite of callsites()) {
    const hasReceiver =
      callsite.getTypeName() !== null && callsite.getFileName() !== null;
    if (hasReceiver) {
      const filename = callsite.getFileName();
      // ignore ourself
        console.debug(`testing ${filename}`);
      if (
        !filename.includes(core_src) &&
        !filename.startsWith("internal/")
      ) {
          console.debug(`returning ${filename}`);
        return dirname(filename);
      } else {
          console.debug(`${filename} includes ${core_src} (or internal/)`);
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

export const require_pkg = (pkg_name: string) => {
  const origin_dir = _caller_dir();

  if (
    !(
      require_from_dir(`@surucode/suru-pkg-${pkg_name}`, origin_dir) ||
      require_from_dir(`${pkg_name}`, origin_dir)
    )
  ) {
    throw new Error(
      `Could not require package '${pkg_name}' from context: ${origin_dir}`
    );
  }
};
