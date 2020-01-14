#!/bin/bash
cd /apps/bleVirtualDevice
chmod +x /apps/bleVirtualDevice/bin/udptest
chmod +x /apps/bleVirtualDevice/node_modules/.bin/pm2
/apps/bleVirtualDevice/node_modules/.bin/pm2 start /apps/bleVirtualDevice/index.js -o /tmp/bleVirtualDevice.log -e /tmp/bleVirtualDevice.log --time