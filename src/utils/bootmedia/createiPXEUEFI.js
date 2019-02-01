const fs = require("fs");

module.exports.createiPXEUEFI = async (ipxeUefiPath, script, ctx) => {
  const ipxeUefi = fs.createWriteStream(ipxeUefiPath);
  const streamUefi = await ctx.call("ipxe.create", {
    script,
    platform: "bin-x86_64-efi",
    driver: "ipxe",
    extension: "efi"
  });
  streamUefi.pipe(ipxeUefi);
  return ipxeUefi;
};
