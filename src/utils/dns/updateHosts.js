const { init } = require("./init");
const fs = require("fs");

module.exports.updateHosts = async ({ hosts, tempdir }) => {
  await init({ tempdir, hosts: true });
  fs.writeFileSync(`${tempdir}/hosts`, hosts);
  return hosts;
};
