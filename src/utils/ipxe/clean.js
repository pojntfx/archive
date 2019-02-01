const shell = require("shelljs");

module.exports.clean = async tempdir => {
  shell.rm("-rf", tempdir);
  return shell.ls(tempdir);
};
