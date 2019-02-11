const shell = require("shelljs");

module.exports.Ss = class {
  static async getAllPorts() {
    return shell.exec("ss -tlnp");
  }
};
