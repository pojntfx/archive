const { MkDosFs } = require("../../bindings/mkdosfs");
const { Mcopy } = require("../../bindings/mcopy");

module.exports.packageIMG = async (label, buildir, packagedir) => {
  await MkDosFs.makeDosFilesystem({
    label,
    dest: `${packagedir}/grub.img`,
    size: 2048
  });
  await Mcopy.mcopy({
    src: `${buildir}/EFI`,
    dest: `${packagedir}/grub.img`
  });
  return `${packagedir}/grub.img`;
};
