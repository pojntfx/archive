const Gateway = require("moleculer-web");

module.exports = {
  mixins: [Gateway],
  settings: {
    routes: [
      {
        whitelist: [
          "bootmedia.create",
          "bootmedia.list",
          "bootmedia.get",
          "bootmedia.delete",
          "dnsmasq.set",
          "dnsmasq.get",
          "dnsmasq.start",
          "dnsmasq.stop",
          "dnsmasq.status",
          "dnsmasq.logs",
          "dnsmasq.interfaces",
          "ipxescripts.*",
          "preseeds.*",
          "postseeds.*"
        ],
        aliases: {
          "POST bootmedia": "bootmedia.create",
          "GET bootmedia": "bootmedia.list",
          "GET bootmedia/:id": "bootmedia.get",
          "DELETE bootmedia/:id": "bootmedia.delete",
          "PUT pxeboot": "dnsmasq.set",
          "GET pxeboot": "dnsmasq.get",
          "POST pxeboot/on": "dnsmasq.start",
          "POST pxeboot/off": "dnsmasq.stop",
          "GET pxeboot/status": "dnsmasq.status",
          "GET pxeboot/logs": "dnsmasq.logs",
          "GET pxeboot/interfaces": "dnsmasq.interfaces",
          "REST pxeboot/scripts": "ipxescripts",
          "REST pxeboot/preseeds": "preseeds",
          "REST pxeboot/postseeds": "postseeds"
          // Don't forget to whitelist your service above! (keep
          // this note to prevent endless pain)
        }
      }
    ]
  }
};
