const dns = require("./services/dns/dns");
const gateway = require("./services/gateway/gateway");
const bootmedia = require("./services/provisioner/bootmedia");
const grub = require("./services/provisioner/grub");
const ipxe = require("./services/provisioner/ipxe");
const iso = require("./services/provisioner/iso");
const mainscripts = require("./services/provisioner/mainscripts");
const postseeds = require("./services/provisioner/postseeds");
const preseeds = require("./services/provisioner/preseeds");
const syslinux = require("./services/provisioner/syslinux");
const pxeboot = require("./services/pxeboot/pxeboot");

module.exports = {
  dns,
  gateway,
  bootmedia,
  grub,
  ipxe,
  iso,
  mainscripts,
  postseeds,
  preseeds,
  syslinux,
  pxeboot
};
