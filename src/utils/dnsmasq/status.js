const shell = require("shelljs");

module.exports.status = async () => shell.exec("pm2 info dnsmasq");
