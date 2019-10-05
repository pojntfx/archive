const fs = require("fs");

module.exports.createISOHdpfx = async (isohdpfxPath, ctx) => {
  const isohdpfx = fs.createWriteStream(isohdpfxPath);
  const streamIsohdpfx = await ctx.call("syslinux.create", {
    fragment: "isohdpfx.bin"
  });
  streamIsohdpfx.pipe(isohdpfx);
  return isohdpfx;
};
