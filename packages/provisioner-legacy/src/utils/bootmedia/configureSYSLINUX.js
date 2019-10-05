const fs = require("../../bindings/asyncFs");

module.exports.configureSYSLINUX = async isolinuxPath =>
  await fs.writeFile(
    `${isolinuxPath}/isolinux.cfg`,
    `default iPXE
          label iPXE
kernel /ipxe/ipxe.lkrn`
  );
