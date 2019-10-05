const { QuickFedoraMirror } = require("../../bindings/quickFedoraMirror");

module.exports.getUpstream = async (srcdir, configFile) =>
  QuickFedoraMirror.mirror({
    pathToBinary: `${srcdir}/quick-fedora-mirror`,
    configFile
  });
