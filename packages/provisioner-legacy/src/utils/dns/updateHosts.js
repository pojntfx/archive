const { init } = require("./init");
const fs = require("../../bindings/asyncFs");

module.exports.updateHosts = async ({ hosts, tempdir }) => {
  await init({ tempdir, hosts: true });
  await fs.writeFile(`${tempdir}/hosts`, hosts);
  return hosts;
};
