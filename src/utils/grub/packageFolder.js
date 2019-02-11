const shell = require("shelljs");
const { Zip } = require("../../bindings/zip");

module.exports.packageFolder = async (buildir, packagedir) => {
  shell.cd(buildir);
  await Zip.createArchive("EFI", `${packagedir}/grub.zip`);
  return `${packagedir}/grub.zip`;
};
