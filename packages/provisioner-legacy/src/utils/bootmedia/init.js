const shell = require("shelljs");

module.exports.init = async paths => {
  shell.mkdir("-p", paths.ipxe);
  shell.mkdir("-p", paths.isolinux);
  shell.mkdir("-p", paths.grub);
  shell.mkdir("-p", paths.package);
  return paths;
};
