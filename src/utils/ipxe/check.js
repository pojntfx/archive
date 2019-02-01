const shell = require("shelljs");

module.exports.check = async available => {
  const availablePackages = shell.exec(`pkcon get-packages --filter installed`);
  return [
    "git",
    "gcc",
    "binutils",
    "make",
    "perl",
    "xz",
    "xz-devel",
    "mtools",
    "genisoimage",
    "syslinux",
    "xorriso"
  ].filter(dependency =>
    available
      ? availablePackages.includes(dependency)
      : !availablePackages.includes(dependency)
  );
};
