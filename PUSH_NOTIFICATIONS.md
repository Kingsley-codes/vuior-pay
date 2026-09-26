# Firebase push notifications

## What changed

The Firestore notifications collection remains the shared inbox. Each newly created
notification now invokes sendNotificationPush, covering payment, reminder, autopay,
credit and general notifications without changing existing producers. Reading,
deleting or updating an inbox item does not send push. Old notifications are not
backfilled. Email delivery remains unchanged.

notifyBillPaid listens for bills changing from any non-paid status to paid. It
creates one payment notification addressed to userId (or legacy user_id), with a
90-day expiry. Retried Firestore events reuse the same notification ID. Edits to
an already-paid bill do not create another notification. The existing CRM mark-paid
operation is sufficient; no CRM push credentials or new client call are needed.

The web app adds an Enable push notifications button in the notification menu,
a foreground alert, background service-worker delivery, safe dashboard links,
a browser-specific off switch, token refresh on return, and logout/account cleanup.
The inbox remains usable when push is denied, unsupported or unconfigured.

## Environment templates

These are Firebase/push templates, not replacements for existing payment, email,
map or authentication settings. Merge the entries into existing environments.

| Repository | Template | New push value |
| --- | --- | --- |
| vuior-pay | .env.example | NEXT_PUBLIC_FIREBASE_VAPID_KEY |
| vuior-crm | .env.example | None; existing Firebase config only |
| vuior-functions | functions/.env.example | None; Firebase supplies Admin SDK credentials |
| Vuior-APP-2 | .env.example | None introduced; native push client is not part of this web update |

Use the same Firebase project for the web app, CRM and deployed functions. The
web and CRM variable names differ; copy the names from each repo's own template.

## Setup and deployment

1. In Firebase Console, open Project settings > Cloud Messaging > Web Push
   certificates. Choose Generate key pair, then copy the public Key pair value.
   Put it in NEXT_PUBLIC_FIREBASE_VAPID_KEY in vuior-pay's .env.local and hosting
   environment. A messaging sender ID is not a substitute for this key. No private
   VAPID key belongs in a client environment. Keep the existing Firebase web config.
2. Confirm the Firebase Cloud Messaging API (HTTP v1) and FCM Registration API are
   enabled for the project. Functions need a Firebase billing plan that supports
   their deployment. This change uses the Admin SDK; no legacy server key is used.
3. From vuior-functions, deploy the new functions and token privacy rule:

   firebase deploy --project <your-project-id> --only functions:registerPushDevice,functions:unregisterPushDevice,functions:notifyBillPaid,functions:sendNotificationPush,firestore:rules

4. Rebuild and redeploy vuior-pay after setting its NEXT_PUBLIC variables. Firebase
   SDK scripts are pinned to 12.17.1 in public/firebase-messaging-sw.js; update them
   together with the SDK dependency. If you add a CSP, permit the Firebase SDK's
   gstatic imports and required Firebase endpoints. The /firebase-messaging-config
   route intentionally exposes only public web config.
5. Serve the app over HTTPS. Callable origins use the existing ALLOWED_ORIGINS in
   functions/lib/http-security.js; add your actual custom/preview origin there if
   it differs from the existing Vercel URLs. Localhost must be explicitly allowed
   for live callable testing. Register/sign in to an active verified user account,
   open the notification menu and choose Enable push notifications.

The Firebase setup and receiving guides are available at:
https://firebase.google.com/docs/cloud-messaging/web/get-started
https://firebase.google.com/docs/cloud-messaging/web/receive-messages

## Acceptance checks after deployment

- Foreground: trigger an existing notification. Confirm one inbox item and an alert.
- Background: put every app tab in the background, trigger another notification,
  and confirm a system notification opens the relevant dashboard page.
- CRM: mark a test user's in-review bill paid. Confirm a Bill paid inbox item and
  push on that user's subscribed browser. Edit the same paid bill again; confirm
  no additional paid notification. Another account must not receive it.
- Disable push or log out; confirm future pushes do not display on that browser.
- Deny browser permission; confirm the inbox and its read/delete controls still work.
- In the Firebase logs, inspect notification_push_retry entries if delivery fails.
  Logs deliberately omit raw device tokens and notification contents.

Do not mark a real customer bill paid just to test this integration.

## Delivery and platform limits

Push requires browser consent and supported browser/OS settings. Foreground
messages use in-app alerts. On iOS/iPadOS, web push requires a compatible Home
Screen web app; the web manifest declares standalone display. Native Expo mobile
push is separate: the referenced mobile repo has no FCM messaging receiver/token
registration added by this change. Its .env.example describes the native config
files without inventing an unused VAPID variable.

Delivery is at least once, not exactly once. The backend records successful token
sends and retries failures; there remains a crash window between FCM acceptance
and saving progress. The worker deduplicates the most recent 200 notification IDs.
Tokens are stored in server-only pushDevices documents, one owner per token.
Unregistered tokens are removed; records older than 90 days are skipped until
refreshed. If a user clears site data, they need to enable notifications again.
No new composite index is required for these queries. Existing email, inbox
retention and mobile inbox readers remain unchanged.

## Automated checks

From vuior-functions/functions:

    node --test tests/push-notifications.test.js

From vuior-pay:

    node --test tests/push-worker.test.cjs
    pnpm exec tsc --noEmit
    pnpm build

The unit tests mock Firebase and worker persistence; they do not send live pushes.
A production build and unit tests do not replace the deployment acceptance checks.
