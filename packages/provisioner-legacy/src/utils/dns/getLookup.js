const { NsLookup } = require("../../bindings/nslookup");

module.exports.getLookup = async ({ domain, dnsServer }) =>
  await NsLookup.getLookup({ domain, dnsServer });
