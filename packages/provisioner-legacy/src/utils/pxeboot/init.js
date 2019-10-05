const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");

module.exports.init = async (iPXEBIOSPath, iPXEUEFIPath, scriptPath) => {
  shell.mkdir("-p", scriptPath);
  await fs.writeFile(iPXEBIOSPath, "");
  return await fs.writeFile(iPXEUEFIPath, "");
};
