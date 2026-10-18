#!/usr/bin/env bash
# Uploads the demo apps to the cloud provider selected by CLOUD (sauce|browserstack).
# Reads credentials from the environment only; prints the references to put in .env / CI.
# Usage: CLOUD=sauce scripts/upload-apps.sh   |   CLOUD=browserstack scripts/upload-apps.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="$ROOT/apps"
ANDROID_APK="$APPS_DIR/android.wdio.native.app.v2.2.0.apk"
CLOUD="${CLOUD:-}"

[[ -f "$ANDROID_APK" ]] || { echo "run scripts/download-apps.sh first" >&2; exit 1; }

case "$CLOUD" in
  sauce)
    : "${SAUCE_USERNAME:?set SAUCE_USERNAME}" "${SAUCE_ACCESS_KEY:?set SAUCE_ACCESS_KEY}"
    REGION="${SAUCE_REGION:-us-west-1}"
    echo "Uploading Android app to Sauce Labs ($REGION)…"
    curl --fail --silent --show-error -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" \
      -X POST "https://api.$REGION.saucelabs.com/v1/storage/upload" \
      -F "payload=@$ANDROID_APK" -F "name=$(basename "$ANDROID_APK")" | node -e '
        let d=""; process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d).item;
        console.log(`SAUCE_ANDROID_APP=storage:${j.id}   # or storage:filename=${j.name}`);});'
    echo "iOS real devices need a signed .ipa (not the simulator .app). Build one from"
    echo "https://github.com/webdriverio/native-demo-app and upload it the same way."
    ;;
  browserstack)
    : "${BROWSERSTACK_USERNAME:?set BROWSERSTACK_USERNAME}" "${BROWSERSTACK_ACCESS_KEY:?set BROWSERSTACK_ACCESS_KEY}"
    echo "Uploading Android app to BrowserStack App Automate…"
    curl --fail --silent --show-error -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
      -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
      -F "file=@$ANDROID_APK" -F "custom_id=wdio-native-demo-android" | node -e '
        let d=""; process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);
        console.log(`BROWSERSTACK_ANDROID_APP=${j.app_url}`);});'
    echo "iOS real devices need a signed .ipa; upload it with the same endpoint and export BROWSERSTACK_IOS_APP."
    ;;
  *)
    echo "usage: CLOUD=sauce|browserstack $0" >&2; exit 2 ;;
esac
