# Felicitas Pojtinger's Provisioner TODO

## New Distributed Build System Architecture Concept

### Build New Artifacts

```plaintext
POST    pxeboot.artifacts
ARGS    script
CALLS   pxebootmanager
            - grubmanager
            - syslinuxmanager
            - ipxemanager
            - ipxemanager
                - grubmariadb
                - syslinuxmariadb
                - ipxemariadb
                - ipxemariadb
                    - grubworker
                    - syslinuxworker
                    - ipxeworker
                    - ipxeworker
                        - grubminio
                        - syslinuxminio
                        - ipxeminio
                        - ipxeminio
RESULT  PXEBootArtifactsID: 1
```

### Get Artifact IDs

```plaintext
GET     pxeboot.artifacts
ARGS    id
CALLS   pxebootmanager
RESULT  GRUBArtifactID: 1
        SYSLINUXArtifactID: 1
        iPXEBIOSArtifactID: 1
        iPXEUEFIArtifactID: 2
```

### Get Artifact URLs

```plaintext
GET     pxeboot.artifacts.(grub|syslinux|ipxe)
ARGS    id
CALLS   (grubmanager|syslinuxmanager|ipxemanager|ipxemanager)
            (grubmariadb|syslinuxmariadb|ipxemariadb|ipxemariadb)
RESULT  url: (http://minio-(grub|syslinux|ipxe)/(grub|syslinux|ipxe)-artifacts/1.zip|pending)
```
