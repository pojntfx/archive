const shell = require("shelljs");

module.exports.logs = async () =>
  shell.exec("pm2 logs dnsmasq --json --nostream");
