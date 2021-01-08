API="http://localhost:4741"
URL_PATH="/groceries/${ID}"

curl "${API}${URL_PATH}" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \

echo
