set -euo pipefail


TARGET ="${1:-]"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ACTIVE_DIR="${ROOT}/deploy/nginx/active"
STATE="${ROOT}/deploy/state/active.color"

if [[ "$TARGET" != "blue" && "$TARGET" != "green" ]]; then
    echo "Usage: $0 blue|green" >&2; exit 1
fi

cp "${ACTIVE_DIR}/$TARGET.conf" "${ACTIVE_DIR}/upstream.conf"

docker exec megabank-nginx nginx -t
docker exec megabank-nginx nginx -s reload

mkdir -p "$(dirname "$STATE")"
echo "$TARGET" > "$STATE"
echo "Switch vers $TARGET reussi"