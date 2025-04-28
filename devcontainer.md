# Stellar Docs in Devcontainer

Running Stellar Docs in a Devcontainer

## Docusaurus

Docusaurus is running as a background process on port 3000.

On startup you'll see the following:

```bash
Docusaurus running on process: 2363
```

**Restart Docusaurus:**

```
yarn dc-restart
```

**Stop Docusaurus:**

```
yarn dc-stop
```

_Or if that doesn't work:_

```bash
kill -9 $(cat run.pid)
```

**View Docusaurus Startup logs:**

```
tail -f docs.log
```

## Developing in a Github Codespace

You can complete your entire development workflow from within this Github Codespace!

https://docs.github.com/en/codespaces/developing-in-a-codespace/developing-in-a-codespace#working-in-a-codespace-in-the-browser

Commiting
changes:  https://docs.github.com/en/codespaces/developing-in-a-codespace/using-source-control-in-your-codespace#committing-your-changes

Create a pull
request: https://docs.github.com/en/codespaces/developing-in-a-codespace/using-source-control-in-your-codespace#raising-a-pull-request