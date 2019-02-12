const fs = require("../../bindings/asyncFs");

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
  await fs.writeFile(`${tempdir}/dnsmasq.conf`, script);
  return script;
};
