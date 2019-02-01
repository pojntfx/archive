const shell = require("shelljs");
const fs = require("fs");

module.exports.build = async (
  indir,
  outdir,
  platform,
  architecture,
  extension,
  label
) => {
  shell.cd(indir);
  shell.exec("./autogen.sh");
  shell.exec(`./configure --prefix=${indir}/out --with-platform=${extension}`);
  shell.exec("make");
  shell.exec("make install");
  // Create the embedded script
  fs.writeFileSync(
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
  return shell.exec(
    `${indir}/out/bin/grub-mkimage -O ${platform} -o ${outdir}/EFI/BOOT/boot${architecture}.efi -p "" --config "${indir}/embedded.cfg" part_gpt part_msdos ntfs ntfscomp hfsplus fat ext2 normal chain boot configfile linux multiboot iso9660 gfxmenu gfxterm loadenv efi_gop efi_uga loadbios fixvideo png ext2 ntfscomp loopback search minicmd cat cpuid appleldr elf usb videotest halt help ls reboot echo test normal sleep memdisk tar font video_fb video gettext true  video_bochs video_cirrus multiboot2 acpi gfxterm_background gfxterm_menu linux16`
  );
};
