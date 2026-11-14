#!/bin/sh
# Asks for a Gemini API key without showing it, and saves it to .env next to server.mjs.
cd "$(dirname "$0")/.." || exit 1
printf 'Paste your Gemini API key, then press Enter (it will not be shown): '
stty -echo 2>/dev/null
IFS= read -r KEY
stty echo 2>/dev/null
printf '\n'
KEY=$(printf '%s' "$KEY" | tr -d '[:space:]')
if [ -z "$KEY" ]; then echo "No key entered. Nothing was saved."; exit 1; fi
MODEL=gemini-3.5-flash-lite
if [ -f .env ]; then OLD=$(grep '^GEMINI_MODEL=' .env | head -1 | cut -d= -f2); [ -n "$OLD" ] && MODEL=$OLD; fi
umask 077
printf 'GEMINI_API_KEY=%s\nGEMINI_MODEL=%s\n' "$KEY" "$MODEL" > .env
echo "Saved to oriscan-finland/.env (${#KEY} characters, model $MODEL). Restart the server to use it."
