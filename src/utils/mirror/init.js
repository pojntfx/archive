const shell = require("shelljs");

module.exports.init = async (outdir, logpath, logfile, timefile, srcdir) => {
  shell.mkdir("-p", outdir);
  shell.mkdir("-p", logpath);
  shell.exec(`echo "" > ${logfile}`);
  shell.exec(`echo "" > ${timefile}`);
  return shell.mkdir("-p", srcdir);
};
