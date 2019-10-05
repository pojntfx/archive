const shell = require("shelljs");
const { Echo } = require("../../bindings/echo");

module.exports.init = async (outdir, logpath, logfile, timefile, srcdir) => {
  shell.mkdir("-p", outdir);
  shell.mkdir("-p", logpath);
  await Echo.echoEmpty(logfile);
  await Echo.echoEmpty(timefile);
  return shell.mkdir("-p", srcdir);
};
