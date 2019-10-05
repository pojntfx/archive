const shell = require("shelljs");

module.exports.MkDosFs = class {
  static async makeDosFilesystem({ label, dest, size }) {
    return shell.exec(
      `mkdosfs -F12 -n "${label
        .split(" ")
        .join("_")
        .toUpperCase()}_EFI" -C ${dest} ${size}`
    );
  }
};
