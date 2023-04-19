# Welcome to Remix!

-   [Remix Docs](https://remix.run/docs)

## Development

### Setup Firestore emulator
Prerequisites:
1. Have firebase cli installed `curl -sL https://firebase.tools | bash`
2. Have java installed

Start emulator:
```sh
firebase emulators:start
```

Start emulator with exported data (to preserve DB)

```sh
firebase emulators:start  --import ./exported/
```

Export data when emulator is killed (to preserve DB)

```sh
firebase emulators:start --export-on-exit ./exported/
```


### Start application
```sh
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

-   `build/`
-   `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

### Firestore deploy

`firebase deploy --only firestore:rules`

### App deploy

App runs at Vercel: poll-app-ivory.vercel.app
