set -e

echo ""
echo "새 시드 생성:"
id=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name": "test"}' http://localhost:3000/seeds | jq -r '.id')

echo ""
echo "모든 시드 조회:"
curl --location --request GET 'http://localhost:3000/seeds'

echo ""
echo "ID로 시드 조회:"
curl --location --request GET "http://localhost:3000/seeds/$id"

echo ""
echo "시드 업데이트:"
curl --location --request PATCH "http://localhost:3000/seeds/$id" \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "name": "updated seed"
}'

echo ""
echo "시드 삭제:"
curl --location --request DELETE "http://localhost:3000/seeds/$id"
