#!/usr/bin/env bash
# Install the native libraries Chromium needs on a minimal Debian/Ubuntu system.
# Puppeteer ships a Chrome binary, but it still needs these .so files present.
#
# Usage:  sudo ./setup.sh
#
# Skip this if you already have a system Chrome/Chromium, or if you're running
# via Docker (the Dockerfile bakes them in).

set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo: sudo ./setup.sh" >&2
  exit 1
fi

echo "Installing Chromium runtime libraries..."
apt-get update -qq
apt-get install -y -qq \
  libnspr4 libnss3 \
  libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 \
  libcups2 libdrm2 libgbm1 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libxfixes3 libxext6 \
  libasound2 libpango-1.0-0 libcairo2 \
  libdbus-1-3 libexpat1 \
  fonts-liberation fonts-noto-color-emoji \
  ca-certificates

echo
echo "Done. You can now render with:"
echo "  npx postkit render posts/<post-slug>"
