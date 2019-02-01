const shell = require("shelljs");

module.exports.init = async (indir, buildir, packagedir) => {
  shell.mkdir("-p", indir);
  shell.mkdir("-p", packagedir);
  shell.mkdir("-p", `${buildir}/EFI/BOOT`);
  return shell.mkdir("-p", `${buildir}/grub`);
};
