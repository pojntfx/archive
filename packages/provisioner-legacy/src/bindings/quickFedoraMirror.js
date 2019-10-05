const shell = require("shelljs");

module.exports.QuickFedoraMirror = class {
  static async mirror({ pathToBinary, configFile }) {
    return shell.exec(`${pathToBinary} -a -c ${configFile} -d 7`);
  }
};
