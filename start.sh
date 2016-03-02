#!/usr/bin/env bash
NAME=blog
PORT=4002
APP='server.js'

NODE_ENV=production PORT=${PORT} pm2 start ${APP} --name ${NAME}
