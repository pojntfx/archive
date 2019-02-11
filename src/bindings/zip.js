const shell = require("shelljs");

module.exports.Zip = class {
  static async createArchive(src, dest) {
    return shell.exec(`zip -r ${dest} ${src}`);
  }
  static async extractArchive(src, dest) {
    return shell.exec(`unzip -d ${dest} ${src}`);
  }
};
