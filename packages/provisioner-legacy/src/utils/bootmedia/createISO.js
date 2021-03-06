const { init } = require("./init");
const { createiPXEBIOS } = require("./createiPXEBIOS");
const { createiPXEUEFI } = require("./createiPXEUEFI");
const { createLDLinux } = require("./createLDLinux");
const { createISOLINUXBin } = require("./createISOLINUXBin");
const { createISOHdpfx } = require("./createISOHdpfx");
const { createGRUBIMG } = require("./createGRUBIMG");
const { createGRUBEFI } = require("./createGRUBEFI");
const shell = require("shelljs");
const { configureGRUB } = require("./configureGRUB");
const { configureSYSLINUX } = require("./configureSYSLINUX");
const { package } = require("./package");
const { Zip } = require("../../bindings/zip");

module.exports.createISO = async ({
  script,
  label,
  efiLabel,
  id,
  packageDir,
  ctx
}) => {
  const paths = {
    ipxe: `/tmp/pojntfx/provisioner/bootmedia/${id}/ipxe`,
    isolinux: `/tmp/pojntfx/provisioner/bootmedia/${id}/isolinux`,
    grub: `/tmp/pojntfx/provisioner/bootmedia/${id}/grub`,
    root: `/tmp/pojntfx/provisioner/bootmedia/${id}`,
    package: packageDir
  };

  await init(paths);

  const files = {
    ipxebios: `${paths.ipxe}/ipxe.lkrn`,
    ipxeuefi: `${paths.ipxe}/ipxe.efi`,
    ldlinux: `${paths.isolinux}/ldlinux.c32`,
    isolinuxbin: `${paths.isolinux}/isolinux.bin`,
    isohdpfx: `${paths.isolinux}/isohdpfx.bin`,
    grubimg: `${paths.grub}/grub.img`,
    grubefi: `${paths.grub}/grub.zip`,
    iso: `${paths.package}/out.iso`
  };

  const ipxebios = await createiPXEBIOS(files.ipxebios, script, ctx);
  const ipxeuefi = await createiPXEUEFI(files.ipxeuefi, script, ctx);
  await createLDLinux(files.ldlinux, ctx);
  await createISOLINUXBin(files.isolinuxbin, ctx);
  await createISOHdpfx(files.isohdpfx, ctx);
  const grubimg = await createGRUBIMG(files.grubimg, efiLabel, ctx);
  await createGRUBEFI(files.grubefi, efiLabel, ctx);

  return new Promise(resolve => {
    ipxebios.on("close", () => {
      ipxeuefi.on("close", () => {
        grubimg.on("close", async () => {
          await Zip.extractArchive(files.grubefi, paths.root);
          shell.rm(files.grubefi);

          await configureGRUB(paths.grub, paths.root, efiLabel);
          await configureSYSLINUX(paths.isolinux);

          shell.cd(paths.root);
          await Zip.createArchive("*", `${paths.package}/out.zip`);

          const iso = await package(files.iso, paths.package, label, ctx);
          iso.on("close", () => resolve(files.iso));
        });
      });
    });
  });
};
