const shell = require("shelljs");

module.exports.Mcopy = class {
  static async mcopy({ src, dest }) {
    return shell.exec(`mcopy -s -i ${dest} ${src} ::`);
  }
};
