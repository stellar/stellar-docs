#!/bin/bash
set -e

kill -9 $(lsof -t -i:3000)
./post_attach_start.sh
