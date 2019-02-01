const shell = require("shelljs");

module.exports.createISO = async ({
  indir,
  packagedir,
  isohdpfxBinPath,
  bootCatPath,
  isolinuxBinPath,
  grubImgPath,
  label
}) => {
  shell.exec(`unzip -d ${indir} ${indir}/content.zip`);
  shell.rm(`${indir}/content.zip`);
  shell.exec(`xorriso \
  -as mkisofs \
  -isohybrid-mbr "${indir}/${isohdpfxBinPath}" \
  -r \
  -partition_offset 16 -J -l -joliet-long \
  -c "${bootCatPath}" \
  -b "${isolinuxBinPath}" \
  -no-emul-boot \
  -boot-info-table \
  -boot-load-size 4 \
  -eltorito-alt-boot \
  -e "${grubImgPath}" \
  -no-emul-boot \
  -isohybrid-gpt-basdat \
  -V "${label}" \
  -o "${packagedir}/out.iso" "${indir}"
`);
  return `${packagedir}/out.iso`;
};
