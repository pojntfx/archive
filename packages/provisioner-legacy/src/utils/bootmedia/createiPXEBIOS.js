const fs = require("fs");

module.exports.createiPXEBIOS = async (ipxeBiosPath, script, ctx) => {
  const ipxeBios = fs.createWriteStream(ipxeBiosPath);
  const streamBios = await ctx.call("ipxe.create", {
    script,
    platform: "bin",
    driver: "ipxe",
    extension: "lkrn"
  });
  streamBios.pipe(ipxeBios);
  return ipxeBios;
};
