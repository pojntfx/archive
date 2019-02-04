const shell = require("shelljs");
const fs = require("fs");

module.exports.getHosts = async tempdir =>
  fs.existsSync(`${tempdir}/hosts`) ? shell.cat(`${tempdir}/hosts`) : false;
