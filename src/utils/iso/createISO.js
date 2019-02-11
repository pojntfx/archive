const shell = require("shelljs");
const { Zip } = require("../../bindings/zip");
const { Xorriso } = require("../../bindings/xorriso");

module.exports.createISO = async ({
  indir,
  packagedir,
  isohdpfxBinPath,
  bootCatPath,
  isolinuxBinPath,
  grubImgPath,
  label
}) => {
  await Zip.extractArchive(indir, `${indir}/content.zip`);
  shell.rm(`${indir}/content.zip`);
  await Xorriso.createBootableIso({
    src: indir,
    isohdpfxBinPath: `${indir}/${isohdpfxBinPath}`,
    bootCatPath,
    grubImgPath,
    isolinuxBinPath,
    label,
    dest: `${packagedir}/out.iso`
  });
  return `${packagedir}/out.iso`;
};
