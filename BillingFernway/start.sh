#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
    PY=python3
elif command -v python >/dev/null 2>&1; then
    PY=python
else
    echo "Error: python3 not found. Install Python first."
    exit 1
fi

PORT=""
for p in 8000 8080 8081 8090 9000; do
    if ! ss -tln 2>/dev/null | grep -q ":$p "; then
        PORT="$p"
        break
    fi
done

if [ -z "$PORT" ]; then
    PORT="${1:-8000}"
fi

HOST="127.0.0.1"
url="http://$HOST:$PORT/index.html"

echo "Starting Fernway POS at: $url"
echo "Press Ctrl+C to stop."

if command -v xdg-open >/dev/null 2>&1; then
    (xdg-open "$url" >/dev/null 2>&1 &)
fi

exec "$PY" -m http.server "$PORT" --bind "$HOST"