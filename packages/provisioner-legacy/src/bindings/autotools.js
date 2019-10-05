const shell = require("shelljs");

module.exports.AutoTools = class {
  static async autogen(path) {
    return shell.exec(`${path ? path : "."}/autogen.sh`);
  }
  static async configure({ path, prefix, args }) {
    return shell.exec(
      `${path ? path : "."}/configure --prefix=${prefix}${
        args ? " " + args : ""
      }`
    );
  }
  static async make(target, args) {
    return shell.exec(`make${target && ` ${target}`}${args && ` ${args}`}`);
  }
  static async makeInstall() {
    return shell.exec("make install");
  }
};
