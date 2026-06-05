# nikkitv APK Setup

## GitHub Secrets Required

Go to repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Name       | Value                        |
|-------------------|------------------------------|
| `KEYSTORE_BASE64` | *(paste full contents of keystore.b64)* |
| `KEYSTORE_PASSWORD` | `nikshep123`               |
| `KEY_ALIAS`       | `nikkitv`                    |
| `KEY_PASSWORD`    | `nikshep123`                 |

## Keystore Info
- **File:** `nikkitv.keystore` (keep this safe, do NOT push to git)
- **Store password:** `nikshep123`
- **Key alias:** `nikkitv`
- **Key password:** `nikshep123`
- **Validity:** 10,000 days (~27 years)

## Steps
1. Create a new GitHub repo
2. Push this folder contents to `main` branch (the `.gitignore` already excludes `android/`, `*.keystore`, `node_modules/`)
3. Add the 4 secrets above
4. Go to Actions → "Build nikkitv APK" → Run workflow
5. APK will be at: Releases → `nikkitv.apk`
6. Download from Artifacts tab too (available for 30 days)

## Notes
- The app icon (NI logo) is baked into the workflow — no need to manage it separately
- `android/` folder is gitignored; Capacitor generates it fresh in CI
- Workflow has `permissions: contents: write` so the release step works without extra token config

## Vercel (Web) Deploy
1. Import repo to Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output dir: `dist`
