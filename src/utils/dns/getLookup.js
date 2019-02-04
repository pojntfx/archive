const shell = require("shelljs");

module.exports.getLookup = async ({ domain, dnsServer }) =>
  shell.exec(`nslookup ${domain}${(dnsServer && ` ${dnsServer}`) || ""}`);
