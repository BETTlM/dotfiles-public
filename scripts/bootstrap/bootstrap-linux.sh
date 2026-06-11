#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <base-url>"
  echo "Example: $0 https://dotfiles.bettim.tech"
  exit 1
fi

BASE_URL="${1%/}"
MANIFEST_URL="$BASE_URL/api/manifest"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

manifest_file="$TMP_DIR/manifest.json"
curl -fsSL "$MANIFEST_URL" -o "$manifest_file"

echo "Installing configs from $BASE_URL"

python3 - "$manifest_file" "$BASE_URL" <<'PY'
import json
import pathlib
import sys
import urllib.request

manifest_path, base_url = sys.argv[1], sys.argv[2]
home = pathlib.Path.home()

with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

for entry in manifest["entries"]:
    target = entry["targetPath"].replace("{{HOME}}", str(home)).replace("~", str(home))
    target = target.replace("{{USERNAME}}", home.name)
    target_path = pathlib.Path(target).expanduser()
    target_path.parent.mkdir(parents=True, exist_ok=True)

    download_url = f"{base_url}/download/{entry['id']}"
    with urllib.request.urlopen(download_url) as response:
        content = response.read()
    target_path.write_bytes(content)
    print(f"Installed: {target_path}")
PY

echo "Bootstrap complete."
