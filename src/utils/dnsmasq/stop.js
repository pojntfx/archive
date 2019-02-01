const shell = require("shelljs");

module.exports.stop = async () => shell.exec("pm2 stop dnsmasq");
