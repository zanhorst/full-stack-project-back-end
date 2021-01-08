API="http://localhost:4741"
URL_PATH="/groceries"
#NAME="name" sh curl-scripts/groceries/create.sh
curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "grocery": {
      "name": "'"${NAME}"'"
    }
  }'

echo
