const { Ip } = require("../../bindings/ip");

module.exports.setNetwork = async interface => {
  await Ip.addIpAddressToInterface("10.0.0.1/24", interface);
  return await Ip.setInterfaceStatus("up", interface);
};
