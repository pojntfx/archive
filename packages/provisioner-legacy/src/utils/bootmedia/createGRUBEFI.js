const fs = require("fs");

module.exports.createGRUBEFI = async (grubEfiPath, label, ctx) => {
  const grubEfi = fs.createWriteStream(grubEfiPath);
  const streamGrubEfi = await ctx.call("grub.create", {
    platform: "x86_64-efi",
    architecture: "x64",
    extension: "efi",
    label,
    fragment: "efi"
  });
  streamGrubEfi.pipe(grubEfi);
  return grubEfi;
};
