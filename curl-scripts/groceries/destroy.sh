API="http://localhost:4741"
URL_PATH="/groceries/${ID}"

curl "${API}${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
