const shell = require("shelljs");

module.exports.init = async ({ tempdir, script, hosts }) => {
  shell.mkdir("-p", tempdir);
  script && shell.exec(`echo "" > ${tempdir}/dnsmasq.conf`);
  hosts && shell.exec(`echo "" > ${tempdir}/hosts`);
};
