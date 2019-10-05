const fs = require("fs");

module.exports.package = async (isoIsoPath, packagedir, label, ctx) => {
  const iso = fs.createWriteStream(isoIsoPath);
  const streamIso = await ctx.call(
    "iso.create",
    fs.createReadStream(`${packagedir}/out.zip`),
    {
      meta: {
        isohdpfxBinPath: "isolinux/isohdpfx.bin",
        bootCatPath: "isolinux/boot.cat",
        isolinuxBinPath: "isolinux/isolinux.bin",
        grubImgPath: "grub/grub.img",
        label
      }
    }
  );
  streamIso.pipe(iso);
  return iso;
};
