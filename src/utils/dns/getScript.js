const shell = require("shelljs");
const fs = require("fs");

module.exports.getScript = async tempdir =>
  fs.existsSync(`${tempdir}/dnsmasq.conf`)
    ? shell.cat(`${tempdir}/dnsmasq.conf`)
    : false;
