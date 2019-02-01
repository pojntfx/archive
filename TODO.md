# OS TODO

## GRUB/SYSLINUX

```plaintext
UEFI/BIOS +---> PXE +
                    |
                    +---> DNSMasq +--> tftp +---> iPXE
                    |
USB +--------> iPXE +
```

### `isolinux.cfg`

```conf
default iPXE
label iPXE
  kernel ipxe.krn
```

### `grub.cfg`

```conf
set default=1
menuentry "iPXE" {
    linux16 ipxe.krn
}
```

## iPXE

```plaintext
iPXE +-------> Main App Launcher +------> Sub App Launcher +------> Sub App Start
```

### `main.ipxe`

```conf
menu Choose Main App
item debian96664bit Debian 9.6.6 64bit
choose --default debian96664bit --timeout 3000 app && goto \${app}

:debian96664bit
dhcp
chain http://ip/operatingsystems/launcher
```

### `apps/debian96664bit/main.ipxe`

```conf
menu Choose Sub App
item start Start
choose --default start --timeout 3000 app && goto \${app}

:start
dhcp
chain http://ip/operatingsystems/debian96664bit/launcher
```

### `apps/debian96664bit/apps/start.ipxe`

```conf
dhcp
kernel http://ip/operatingsystems/debian96664bit/vmlinuz
initrd http://ip/operatingsystems/debian96664bit/initrd.img
boot
```
