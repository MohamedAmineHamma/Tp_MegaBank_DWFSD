set -euo pipefail

TAG="${1:?Usage: deploy.sh <IMAGE_TAG>}"
ROOT="$(cd "$(dirname "$0}")/.." && pwd)"
COMPOSE= "docker compose -f "$ROOT/docker-compose.bluegreen.yml"
STATE="${ROOT}/deploy/state/active.color"

# -------------- Couleur Active

ACTIVE="$(cat "$STATE" 2>/dev/null || echo "blue")"
if [[ "$ACTIVE" == "blue" ]]; then TARGET="green" else TARGET="blue" fi
echo "Active=$ACTIVE,| Deploiement sur =$C:\Users\amine\OneDrive\Bureau\PROJET_DWFSD_DEV_WEB\tp_megaBank\docker-compose.bluegreen.yml | Tag=$TAG"

# -------------- Lancement des containers selon la couleur cible

UP="${TARGET^^}"
export ${UP}_BACKEND_TAG="$TAG"
export ${UP}_FRONTEND_TAG="$TAG"
$COMPOSE up -d --no-deps backend_${TARGET} frontend_${TARGET}

echo "Health-check de $TARGET ..."
for i in ${seq 1 20}; do
    if docker exec megabank-nginx wget -q -O- \
        "http://backend_${TARGET}:4000/api/auth"> /dev/null 2>&1; \
        || docker exec megabank-nginx wget -q -O- \
        "http://front_${TARGET}:4200"> /dev/null 2>&1; then
        echo "$TARGET repond"; break
    fi
    if [[ "$i" -eq "20" ]]; then echo "Echec du health-check de $TARGET"; exit 1; fi
    sleep 3
done


"$ROOT/deploy/switch.sh" "$TARGET"

echo "Smoke Test http://localhost:8080/healthz"
if ! curl -fs http://localhost:8080/healthz > /dev/null; then
    echo "Echec du smoke test" -> rollback vers $ACTIVE
    "$ROOT/deploy/switch.sh" "$ACTIVE"
    exit 1
fi

echo "Deploiement de $TARGET reussi, $ACTIVE est desactive sur la version $TAG"