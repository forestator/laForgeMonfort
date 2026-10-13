# Soirées jeux

React + Vite + TypeScript, Firebase (Firestore, Auth, Hosting), Capacitor for Android.
Same code for the web page and the Android app.

## Setup

1. Create a Firebase project; enable Firestore and Authentication > Google.
2. Add a web app, paste its config into `src/lib/firebase.config.ts`.
3. `npm install && npm run dev`

## Web (Firebase Hosting)

`npm run build && npx firebase-tools deploy` (rules in `firestore.rules` are deployed too).

## Android

1. In Firebase, add an Android app with id `fr.association.soireesjeux` and your SHA-1/SHA-256.
2. Put `google-services.json` in `android/app/`.
3. `npm run build && npx cap sync android && npx cap open android`

See the @capacitor-firebase/authentication docs for the Android Gradle setup.

## Game cover search

Covers come from the BoardGameGeek XML API. BGG now requires an app token
(register at boardgamegeek.com/applications); put it in `.env.local`:

`VITE_BGG_TOKEN=your-token`

Without it the search field is hidden and the game name is typed by hand.
The token ships in the client bundle, so treat it as public.
