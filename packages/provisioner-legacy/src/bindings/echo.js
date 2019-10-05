const shell = require("shelljs");

module.exports.Echo = class {
  static async echoEmpty(path) {
    return shell.exec(`echo "" > ${path}`);
  }
};
