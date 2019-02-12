const fs = require("../../bindings/asyncFs");
const shell = require("shelljs");

module.exports.writeScript = async (scriptDir, script) => {
  shell.mkdir("-p", scriptDir);
  return fs.writeFile(`${scriptDir}/script.ipxe`, script);
};
