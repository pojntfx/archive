const shell = require("shelljs");
const fs = require("fs");

module.exports.getScript = async scriptdir =>
  fs.existsSync(`${scriptdir}/script.ipxe`)
    ? shell.cat(`${scriptdir}/script.ipxe`)
    : false;
