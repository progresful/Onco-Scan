#!/bin/sh
# Asks for an ElevenLabs API key without showing it, and saves it to .env next to server.mjs (other lines are kept).
cd "$(dirname "$0")/.." || exit 1
printf 'Paste your ElevenLabs API key, then press Enter (it will not be shown): '
stty -echo 2>/dev/null
IFS= read -r KEY
stty echo 2>/dev/null
printf '\n'
KEY=$(printf '%s' "$KEY" | tr -d '[:space:]')
if [ -z "$KEY" ]; then echo "No key entered. Nothing was saved."; exit 1; fi
umask 077
touch .env
grep -v '^ELEVENLABS_API_KEY=' .env > .env.tmp
printf 'ELEVENLABS_API_KEY=%s\n' "$KEY" >> .env.tmp
mv .env.tmp .env
echo "Saved to oriscan-finland/.env (${#KEY} characters). You can close this tab."
