const shell = require("shelljs");

module.exports.packageFolder = async (buildir, packagedir) => {
  shell.cd(buildir);
  shell.exec(`zip -r ${packagedir}/grub.zip EFI`);
  return `${packagedir}/grub.zip`;
};
