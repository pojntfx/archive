const shell = require("shelljs");
const fs = require("fs");

module.exports.config = async (
  configfile,
  outdir,
  timefile,
  remote,
  logfile
) => {
  await shell.exec(`echo "" > ${configfile}`);
  return fs.writeFileSync(
    configfile,
    `DESTD=${outdir}
TIMEFILE=${timefile}
REMOTE=rsync://${remote}
MODULES=(fedora-enchilada)
LOGFILE=${logfile}`
  );
};
