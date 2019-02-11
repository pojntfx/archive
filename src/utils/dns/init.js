const shell = require("shelljs");
const { Echo } = require("../../bindings/echo");

module.exports.init = async ({ tempdir, script, hosts }) => {
  shell.mkdir("-p", tempdir);
  script && (await Echo.echoEmpty(`${tempdir}/dnsmasq.conf`));
  hosts && (await Echo.echoEmpty(`${tempdir}/hosts`));
};
