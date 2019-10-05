const fs = require("../../bindings/asyncFs");
const { Echo } = require("../../bindings/echo");

module.exports.config = async (
  configfile,
  outdir,
  timefile,
  remote,
  logfile
) => {
  await Echo.echoEmpty(configfile);
  return await fs.writeFile(
    configfile,
    `DESTD=${outdir}
TIMEFILE=${timefile}
REMOTE=rsync://${remote}
MODULES=(fedora-enchilada)
LOGFILE=${logfile}`
  );
};
