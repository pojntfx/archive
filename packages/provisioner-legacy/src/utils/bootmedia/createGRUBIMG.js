const fs = require("fs");

module.exports.createGRUBIMG = async (grubImgPath, label, ctx) => {
  const grubImg = fs.createWriteStream(grubImgPath);
  const streamGrubImg = await ctx.call("grub.create", {
    platform: "x86_64-efi",
    architecture: "x86",
    extension: "efi",
    label,
    fragment: "img"
  });
  streamGrubImg.pipe(grubImg);
  return grubImg;
};
