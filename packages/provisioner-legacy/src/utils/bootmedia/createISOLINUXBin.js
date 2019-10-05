const fs = require("fs");

module.exports.createISOLINUXBin = async (isolinuxBinPath, ctx) => {
  const isolinuxBin = fs.createWriteStream(isolinuxBinPath);
  const streamIsolinuxBin = await ctx.call("syslinux.create", {
    fragment: "isolinux.bin"
  });
  streamIsolinuxBin.pipe(isolinuxBin);
  return isolinuxBin;
};
