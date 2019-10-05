const { Ss } = require("../../bindings/ss");

module.exports.getPorts = async () => await Ss.getAllPorts();
