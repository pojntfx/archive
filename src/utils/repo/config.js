const shell = require("shelljs");
const fs = require("fs");
const { Echo } = require("../../bindings/echo");

module.exports.config = async (
  configfile,
  outdir,
  timefile,
  remote,
  logfile
) => {
  await Echo.echoEmpty(configfile);
  return fs.writeFileSync(
    configfile,
    `DESTD=${outdir}
TIMEFILE=${timefile}
REMOTE=rsync://${remote}
MODULES=(fedora-enchilada)
LOGFILE=${logfile}`
  );
};
