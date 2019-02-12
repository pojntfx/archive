const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");

module.exports.getHosts = async tempdir =>
  (await fs.exists(`${tempdir}/hosts`)) ? shell.cat(`${tempdir}/hosts`) : false;
