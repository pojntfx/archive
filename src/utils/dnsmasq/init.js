const shell = require("shelljs");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

module.exports.init = async (iPXEBIOSPath, iPXEUEFIPath, scriptPath) => {
  shell.mkdir("-p", scriptPath);
  await writeFile(iPXEBIOSPath, "");
  return await writeFile(iPXEUEFIPath, "");
};
