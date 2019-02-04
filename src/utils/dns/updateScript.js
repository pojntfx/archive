const { init } = require("./init");
const fs = require("fs");

module.exports.updateScript = async ({ script, tempdir }) => {
  await init(tempdir);
  fs.writeFileSync(`${tempdir}/dnsmasq.conf`, script);
  return script;
};
