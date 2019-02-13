# Base image
FROM fedora:30

# Metadata
LABEL maintainer="Felicitas Pojtinger <felicitas@pojtinger.com> @pojntfx"
LABEL license="AGPL-3.0"

# Update the system and install dependencies
RUN dnf update -y
RUN dnf install -y npm git gcc binutils make perl xz xz-devel mtools genisoimage flex bison xorriso iproute dnsmasq syslinux python autoconf automake dosfstools

# Setup work dir
RUN mkdir -p /opt/pojntfx/provisioner/builder
WORKDIR /opt/pojntfx/provisioner/builder

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Add source code
COPY src src

# Configure the app
ENV SERVICEDIR="src/services/builders/managers"
ENV SERVICES="*.js"
ENV TRANSPORTER="TCP"

# Cache files
VOLUME [ "/tmp/pojntfx/provisioner" ]

# Start the app
CMD npm start
