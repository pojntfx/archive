const shell = require("shelljs");

module.exports.getUpstream = async (srcdir, configfile) =>
  shell.exec(`${srcdir}/quick-fedora-mirror -a -c ${configfile} -d 7`);
