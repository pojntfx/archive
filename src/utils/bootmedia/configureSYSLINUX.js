const fs = require("fs");

module.exports.configureSYSLINUX = async isolinuxPath =>
  fs.writeFileSync(
    `${isolinuxPath}/isolinux.cfg`,
    `default iPXE
          label iPXE
kernel /ipxe/ipxe.lkrn`
  );
