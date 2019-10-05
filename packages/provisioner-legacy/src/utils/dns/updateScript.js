const { init } = require("./init");
const fs = require("../../bindings/asyncFs");

module.exports.updateScript = async ({
  noDhcpInterface,
  domain,
  firstNameServer,
  secondNameServer,
  tempdir
}) => {
  await init({ tempdir, script: true });
  const script = `no-dhcp-interface=NO_DHCP_INTERFACE
bogus-priv
domain=DOMAIN
expand-hosts
no-hosts
addn-hosts=/tmp/pojntfx/provisioner/dns/hosts
local=/DOMAIN/
domain-needed
no-resolv
no-poll
server=FIRST_NAME_SERVER
server=SECOND_NAME_SERVER
log-queries
log-dhcp`
    .replace("NO_DHCP_INTERFACE", noDhcpInterface)
    .replace(/DOMAIN/g, domain)
    .replace("FIRST_NAME_SERVER", firstNameServer)
    .replace("SECOND_NAME_SERVER", secondNameServer);
  await fs.writeFile(`${tempdir}/dnsmasq.conf`, script);
  return script;
};
