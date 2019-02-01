# Felicitas Pojtinger's Provisioner

## Features

- Build iPXE for any platform, driver or extension
- Package iPXE as ISO
- Check for missing dependencies
- Clean temporary files
- Serve for both BIOS and UEFI over PXEBoot with DHCP autodiscovery and HTTP Boot using iPXE Scripts

## Docs

Develop with Docker.

```bash
docker-compose up
```

## Debugging

If you get an error like `dnsmasq: failed to bind DHCP server socket: Address already in use`, try and run `pkill -9 dnsmasq` on the host machine; it means that another process already binds to DNSMasq's socket, so you'll need to kill it.

If you send a script, encode it as a URL. _DO NOT_ escape `${...}` as `\${...}` manually or you will end up with very cryptic error messages and/or an instant reboot!

See [Platform README](../../README.md)
