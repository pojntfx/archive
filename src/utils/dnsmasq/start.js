const shell = require("shelljs");

module.exports.start = async () =>
  shell.exec("pm2 start dnsmasq -- -k --log-dhcp --log-queries");
