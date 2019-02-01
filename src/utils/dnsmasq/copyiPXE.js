const shell = require("shelljs");

module.exports.copyiPXE = async (tftpDir, iPXEBIOSPath, iPXEUEFIPath) => {
  shell.mkdir("-p", tftpDir);
  shell.cp(iPXEBIOSPath, tftpDir);
  return shell.cp(iPXEUEFIPath, tftpDir);
};
