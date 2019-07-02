# Hiome Core GUI

This repository includes a nodejs API server powered by Express and static UI front-end generted by Gatsby.

The API talks to a local postgres database to read/write to the hiome db. The UI provides an admin dashboard for that data.

## Local Development

0. Make sure postgres is running on localhost port 5432 and run the migrations from `core-db`.

In first tab:

1. `npm install`
2. `npm run start`

In second tab:

1. `cd ui`
2. `npm install`
3. `npm run develop`

You now have both a nodejs server and a gatsby server running.

## Deployment

```console
# generate static site locally
npm run build

# push up the built assets into a release candidate branch
git checkout -b v1.0rc && git add . && git commit -m 'v1.0 release candidate' && git push origin v1.0rc
```

Switch to a dedicated raspberry pi to build npm modules for ARM architecture and push up all code to our release branch:

```console
# pull release candidate with generated static site
git checkout -b v1.0rc

# npm install locally
rm -rf node_modules/ && npm install

# push finalized release out to release branch
git add .
git commit -m 'add pi modules'
git push origin azul
```

Now our fleet of pi's will slowly pull the latest release and restart their web servers. Everything should already be pre-built and included in git.
