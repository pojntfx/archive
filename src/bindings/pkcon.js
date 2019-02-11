const shell = require("shelljs");

module.exports.Pkcon = class {
  static async getAllInstalledPackages() {
    return shell.exec(`pkcon get-packages --filter installed`);
  }
};
