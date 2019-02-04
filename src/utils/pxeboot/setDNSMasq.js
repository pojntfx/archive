const fs = require("fs");

module.exports.setDNSMasq = async (
  interface,
  domain,
  tftpDir,
  dnsmasqConfigTemplate,
  tempdir
) => {
  const script = dnsmasqConfigTemplate
    .replace("INTERFACE", interface)
    .replace("DOMAIN", domain)
    .replace("TFTPROOT", tftpDir);
  fs.writeFileSync(`${tempdir}/dnsmasq.conf`, script);
  return script;
};
