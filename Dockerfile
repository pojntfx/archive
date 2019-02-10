# Base image
FROM fedora:30

# Metadata
LABEL maintainer="Felicitas Pojtinger <felicitas@pojtinger.com> @pojntfx"
LABEL license="AGPL-3.0"

# Update the system and install dependencies
RUN dnf update -y
RUN dnf install -y npm git gcc binutils make perl xz xz-devel mtools genisoimage flex bison xorriso iproute dnsmasq syslinux python autoconf automake dosfstools bind-utils rsync zsh wget
RUN wget -O /usr/bin/mc https://dl.minio.io/client/mc/release/linux-amd64/mc
RUN chmod +x /usr/bin/mc

# Setup work dir
RUN mkdir -p /opt/pojntfx/provisioner
WORKDIR /opt/pojntfx/provisioner

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Add source code
COPY src src

# Configure the app
ENV SERVICEDIR="src/services"
ENV TRANSPORTER="TCP"

# Start the app
CMD npm start
