# Base image
FROM fedora:28

# Metadata
LABEL maintainer="Felicitas Pojtinger <felicitas@pojtinger.com> @pojntfx"
LABEL license="AGPL-3.0"

# Update the system and install dependencies
RUN dnf update -y
RUN dnf install -y npm git gcc binutils make perl xz xz-devel mtools genisoimage flex bison xorriso iproute dnsmasq syslinux python autoconf automake dosfstools
RUN npm install -g pm2

# Setup work dir
RUN mkdir -p /opt/pojntfx/os
WORKDIR /opt/pojntfx/os

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

# Expose the app
EXPOSE 3000 67 57
