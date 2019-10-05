const shell = require("shelljs");

module.exports.NsLookup = class {
  static async getLookup({ domain, dnsServer }) {
    return shell.exec(
      `nslookup ${domain}${(dnsServer && ` ${dnsServer}`) || ""}`
    );
  }
};
