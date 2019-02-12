const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");
const { AutoTools } = require("../../bindings/autotools");
const { GrubMkImage } = require("../../bindings/grubMkimage");

module.exports.build = async (
  indir,
  outdir,
  platform,
  architecture,
  extension,
  label
) => {
  shell.cd(indir);
  await AutoTools.autogen(".");
  await AutoTools.configure({
    path: ".",
    prefix: `${indir}/out`,
    args: `--with-platform=${extension} --disable-werror`
  });
  await AutoTools.make();
  await AutoTools.makeInstall();
  // Create the embedded script
  await fs.writeFile(
    `${indir}/embedded.cfg`,
    `search --file --set=root /${label
      .split(" ")
      .join("_")
      .toLowerCase()}
  if [ -e ($root)/grub/grub.cfg ]; then
      set prefix=($root)/grub
      configfile $prefix/grub/grub.cfg
  else
      echo "Could not find /grub/grub.cfg!"
  fi`
  );
  shell.mkdir("-p", `${outdir}/EFI/BOOT`);
  // Create the GRUB EFI executable
  return GrubMkImage.makeImage({
    pathToBinary: `${indir}/out/bin/grub-mkimage`,
    platform,
    root: outdir,
    architecture,
    configFile: `${indir}/embedded.cfg`
  });
};
