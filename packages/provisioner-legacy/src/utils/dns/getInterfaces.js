const { Ip } = require("../../bindings/ip");

module.exports.getInterfaces = async () => await Ip.getAllInterfaces();
