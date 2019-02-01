const shell = require("shelljs");

module.exports.packageIMG = async (label, buildir, packagedir) => {
  shell.exec(
    `mkdosfs -F12 -n "${label
      .split(" ")
      .join("_")
      .toUpperCase()}_EFI" -C ${packagedir}/grub.img 2048`
  );
  shell.exec(`mcopy -s -i ${packagedir}/grub.img ${buildir}/EFI ::`);
  return `${packagedir}/grub.img`;
};
