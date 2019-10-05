const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");

module.exports.getScript = async tempdir =>
  (await fs.exists(`${tempdir}/dnsmasq.conf`))
    ? shell.cat(`${tempdir}/dnsmasq.conf`)
    : false;
