const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const shell = require("shelljs");

module.exports.writeScript = async (scriptDir, script) => {
  shell.mkdir("-p", scriptDir);
  return writeFile(`${scriptDir}/script.ipxe`, script);
};
