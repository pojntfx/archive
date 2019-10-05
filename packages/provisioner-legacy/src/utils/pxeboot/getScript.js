const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");

module.exports.getScript = async scriptdir =>
  (await fs.exists(`${scriptdir}/script.ipxe`))
    ? shell.cat(`${scriptdir}/script.ipxe`)
    : false;
