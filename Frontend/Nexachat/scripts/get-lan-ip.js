#!/usr/bin/env node

/*
 * ============================================================
 * scripts/get-lan-ip.js
 * ============================================================
 *
 * Prints the development PC's current LAN IPv4 address (the one
 * on the same network as your phone) — used at BUILD TIME to
 * bake the backend URL into release APKs.
 *
 * Works cross-platform (Windows / macOS / Linux) with zero
 * dependencies. The first private-range address wins, so VPN
 * adapters and virtual switches lose to your real WiFi/Ethernet
 * NIC.
 * ============================================================
 */

const os = require("os");

const isPrivateIPv4 = (address) =>
  /^10\./.test(address) ||
  /^192\.168\./.test(address) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(address);

const addresses = [];

for (const interfaces of Object.values(os.networkInterfaces())) {
  for (const net of interfaces || []) {
    if (net.family !== "IPv4" || net.internal) {
      continue;
    }

    addresses.push(net.address);
  }
}

const privateAddress = addresses.find(isPrivateIPv4);
const anyAddress = addresses[0];

if (privateAddress) {
  console.log(privateAddress);
} else if (anyAddress) {
  console.log(anyAddress);
} else {
  console.error("No non-internal IPv4 address found — are you connected to a network?");
  process.exit(1);
}
