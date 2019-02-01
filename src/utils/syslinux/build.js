const shell = require("shelljs");

module.exports.build = async buildir => {
  shell.cp("/usr/share/syslinux/ldlinux.c32", `${buildir}`);
  shell.cp("/usr/share/syslinux/isolinux.bin", `${buildir}`);
  return shell.cp("/usr/share/syslinux/isohdpfx.bin", `${buildir}`);
};
