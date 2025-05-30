#!/bin/bash
set -e

touch docs.log
chmod 775 docs.log
nohup yarn start --port 3000 > docs.log 2>&1 & echo $! > run.pid

echo "Docusaurus running on process: $(cat run.pid)"
echo "Docusaurus running on port 3000"
echo ""
echo "View logs:  tail -f docs.log"
echo "Restart docusaurus:  ./.devcontainer/restart.sh"
echo "Stop docusaurus:  kill -9 '$(lsof -t -i:3000)'"
echo "Developing in a devcontainer: https://docs.github.com/en/codespaces/developing-in-a-codespace/developing-in-a-codespace#working-in-a-codespace-in-the-browser"