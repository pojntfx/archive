const shell = require("shelljs");

module.exports.init = async tempdir => {
  shell.mkdir("-p", tempdir);
  shell.exec(`echo "" > ${tempdir}/dnsmasq.conf`);
  return shell.exec(`echo "" > ${tempdir}/hosts`);
};
