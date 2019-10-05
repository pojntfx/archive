const { Pkon } = require("../../bindings/pkcon");

module.exports.check = async available => {
  const availablePackages = Pkon.getAllInstalledPackages();
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
