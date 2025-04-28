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


