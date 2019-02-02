const { setNetwork } = require("./setNetwork");
const { copyiPXE } = require("./copyiPXE");
const { writeScript } = require("./writeScript");
const { setDNSMasq } = require("./setDNSMasq");
const { init } = require("./init");

const CONFIGTMPL = `# enable logs if required
#log-queries
#log-dhcp

# disable DNS server
port=0

# listen on PXEBOOT vlan (vlan110) only
listen-address=10.0.0.1
interface=INTERFACE

# enable built-in tftp server
enable-tftp
tftp-root=TFTPROOT


# DHCP range 10.0.0.200 ~ 10.0.0.250
dhcp-range=10.0.0.200,10.0.0.250,255.255.255.0,24h

# Default gateway
dhcp-option=3,10.0.0.1

# Domain name - DOMAIN
dhcp-option=15,DOMAIN

# Broadcast address
dhcp-option=28,10.0.0.255

# Set interface MTU to 9000 bytes (jumbo frame)
# Enable only when your network supports it
# dhcp-option=26,9000

# Tag dhcp request from iPXE
dhcp-match=set:ipxe,175

# inspect the vendor class string and tag BIOS client
dhcp-vendorclass=BIOS,PXEClient:Arch:00000

# Boot file - Legacy BIOS client
dhcp-boot=tag:!ipxe,tag:BIOS,undionly.kpxe,10.1.0.1

# Boot file - EFI client
# at the moment all non-BIOS clients are considered
# EFI client
dhcp-boot=tag:!ipxe,tag:!BIOS,ipxe.efi,10.1.0.1`;

module.exports.set = async ({
  interface,
  domain,
  tftpDir,
  scriptDir,
  script,
  iPXEBIOSPath,
  iPXEUEFIPath
}) => {
  await setNetwork(interface);
  await copyiPXE(tftpDir, iPXEBIOSPath, iPXEUEFIPath);
  await writeScript(scriptDir, script);
  return await setDNSMasq(interface, domain, tftpDir, CONFIGTMPL);
};
