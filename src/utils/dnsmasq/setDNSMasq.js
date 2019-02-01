const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

module.exports.setDNSMasq = async (
  interface,
  domain,
  tftpDir,
  dnsmasqConfigTemplate
) => {
  const dnsmasqConfig = dnsmasqConfigTemplate
    .replace("INTERFACE", interface)
    .replace("DOMAIN", domain)
    .replace("TFTPROOT", tftpDir);
  return await writeFile("/etc/dnsmasq.conf", dnsmasqConfig);
};
