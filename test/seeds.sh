#!/bin/bash

set -e

BASE_URL=http://localhost:3000

echo "Create Seed"
SEED_NAME="Seed 1"
CREATED_SEED=$(curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"$SEED_NAME\"}" "$BASE_URL/seeds")
SEED_ID=$(echo $CREATED_SEED | jq -r '.id')

echo "Get Seeds"
curl -X GET "$BASE_URL/seeds"

echo "Get Seed by ID"
curl -X GET "$BASE_URL/seeds/$SEED_ID"

echo "Update Seed"
UPDATED_SEED=$(curl -X PATCH -H "Content-Type: application/json" -d "{\"name\":\"Updated Seed\"}" "$BASE_URL/seeds/$SEED_ID")

echo "Delete Seed"
curl -X DELETE "$BASE_URL/seeds/$SEED_ID"

echo "Get Seed by ID (Not Found)"
curl -X GET "$BASE_URL/seeds/$SEED_ID" && true

echo "Update Seed (Not Found)"
curl -X PATCH -H "Content-Type: application/json" -d "{\"name\":\"Updated Seed\"}" "$BASE_URL/seeds/999" && true

echo "Delete Seed (Not Found)"
curl -X DELETE "$BASE_URL/seeds/999" && true

echo "Success"
