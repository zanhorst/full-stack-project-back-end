#!/bin/bash

API="http://localhost:4741"
URL_PATH="${URL_PATH}"

curl "http://localhost:4741/" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
