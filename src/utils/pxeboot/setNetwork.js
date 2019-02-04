const shell = require("shelljs");

module.exports.setNetwork = async interface => {
  shell.exec(`ip addr add 10.0.0.1/24 dev ${interface}`);
  return shell.exec(`ip link set ${interface} up`);
};
