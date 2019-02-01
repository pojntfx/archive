const shell = require("shelljs");
const fs = require("fs");

module.exports.configureGRUB = async (grubPath, indir, label) => {
  fs.writeFileSync(
    `${grubPath}/grub.cfg`,
    `set default=1
set timeout=1

menuentry "iPXE" {
chainloader /ipxe/ipxe.efi
}`
  );
  return shell.touch(
    `${indir}/${label
      .split(" ")
      .join("_")
      .toLowerCase()}`
  );
};
