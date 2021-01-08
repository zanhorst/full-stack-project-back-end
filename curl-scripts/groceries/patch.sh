API="http://localhost:4741"
URL_PATH="/groceries/${ID}"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "grocery": {
      "name": "'"${NAME}"'"
    }
  }'

echo
