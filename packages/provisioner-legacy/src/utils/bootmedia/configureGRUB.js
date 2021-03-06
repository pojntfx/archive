const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");

module.exports.configureGRUB = async (grubPath, indir, label) => {
  await fs.writeFile(
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
