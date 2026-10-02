# Data safety — HVAC Legends

Play Console → Policy and programs → App content → Data safety.

Package: `com.hvaclegends.app`. New app. Not the HVAC Allstars package.

Answer in the order Play asks: collected, then shared, then encrypted in transit, then deletion.

Developer: Andrew Hubbard. The privacy policy ships inside the app at `privacy.html`. A public https privacy URL still has to be hosted before publish. It is not live yet.

## 1. Collected?

**Does your app collect or share any of the required user data types?**

**Yes.**

Play means “collected” as sent off the phone. Most of HVAC Legends never leaves the device.

### Not collected (on the device only)

- Callsign
- Optional locker photo
- Lab progress
- XP

Not sold. Not used for ads. No account is required to run the labs. Do not declare these as collected. Do not declare Photos. The locker photo is not uploaded by the core app.

### Collected only if the user uses the feature

These are optional. The labs run if the user never opens them.

| Play data type | What it is | Collected when |
| --- | --- | --- |
| Personal info → Name | The callsign they typed | Class chat, a class PIN, or a review note |
| Messages → Other in-app messages | Class chat text, and review notes they choose to send | They use class chat or send a review note |
| App activity → App interactions | Scores in a class room | They use a class PIN |

For each row above, set:

- Collected: Yes
- Shared: No
- Processed ephemerally: No
- Required or optional: Optional
- Purpose: App functionality only

Not for advertising. Not for marketing. Not for analytics.

Do not declare location, contacts, financial info, health, files, photos, audio, web browsing, device IDs, or advertising ID.

## 2. Shared?

**Is this data shared?**

**No.**

Not sold. Not shared with advertisers, data brokers, or other companies for their own use. Not used for ads. There is no advertising ID.

A class the user chooses to join can see the callsign and what they post in that class. They opened class chat or the class PIN and can expect that room to see it. That is not a sale, and it is not a public social network. Do not check Shared.

## 3. Encrypted in transit?

**Is all of the user data collected by your app encrypted in transit?**

**Yes, if the optional host is HTTPS.**

Callsign, optional locker photo, lab progress, and XP are not transmitted. Transit encryption does not apply to the locker.

Class chat, a class PIN, and review notes are sent only when the user uses them. Check **Yes** when that host is HTTPS.

Check **No** if the build you publish still joins a class over a plain HTTP address. That local hop is not encrypted. There is no second connection for ads.

## 4. Deletion?

**Which account-creation methods does the app support?**

**My app does not allow users to create an account.**

The locker is a name and password stored on the phone. No account is required to run the labs. There is no server account to delete for the core app.

**Do you provide a way for users to request that their data is deleted?**

**Yes.**

Deletion method: the in-app locker reset, and clearing app storage.

1. On the clock-in screen, type the locker name and tap **Forgot password · reset this locker on this device**. That locker is removed from the phone.
2. Android Settings → Apps → HVAC Legends → Storage → Clear storage. That clears callsign, the optional locker photo, lab progress, and XP.

Optional class chat, a class PIN, and review notes do not create an account. Clearing the phone does not pull back a message that already reached a class host. There is still no Legends account for a “delete my account” URL to point at.

## Permissions

The Android wrapper declares INTERNET and VIBRATE only.

No location permission. No ads.
