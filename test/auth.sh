#!/bin/bash
set -e

# 0. 회원가입
SIGNUP=$(curl --location --request POST 'http://localhost:3000/users' \
    --silent \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "email": "test@test.com",
    "password": "testpassword",
    "birthdate": "1990-01-01",
    "username": "testUser",
    "firstName": "testFirstName",
    "lastName": "testLastName"
}')

# 1. 로그인
LOGIN=$(curl -X POST \
    --silent \
    http://localhost:3000/auth/login \
    -H 'Content-Type: application/json' \
    -d '{
    "email": "test@test.com",
    "password": "testpassword"
  }')

# Access Token 추출
ACCESS_TOKEN=$(echo $LOGIN | jq -r '.accessToken')
echo ""
echo "ACCESS_TOKEN = "
echo "$ACCESS_TOKEN"

# Refresh Token 추출
REFRESH_TOKEN=$(echo $LOGIN | jq -r '.refreshToken')
echo ""
echo "REFRESH_TOKEN = "
echo "$REFRESH_TOKEN"

# 2. Access Token을 이용한 profile 요청
PROFILE=$(curl -X GET \
    --silent \
    http://localhost:3000/auth/profile \
    -H "Authorization: Bearer $ACCESS_TOKEN")

echo ""
echo "profile 1 : "
echo "$PROFILE"

# 3. Access Token 재발급 요청
REFRESHED=$(curl -X POST \
    --silent \
    http://localhost:3000/auth/refresh-token \
    -H 'Content-Type: application/json' \
    -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }')

echo ""
echo "REFRESHED = "
echo "$REFRESHED"

# Access Token 추출
ACCESS_TOKEN=$(echo $REFRESHED | jq -r '.accessToken')
echo ""
echo "ACCESS_TOKEN = "
echo "$ACCESS_TOKEN"

# Refresh Token 추출
REFRESH_TOKEN=$(echo $REFRESHED | jq -r '.refreshToken')
echo ""
echo "REFRESH_TOKEN = "
echo "$REFRESH_TOKEN"

# 4. Access Token을 이용한 profile 요청
PROFILE=$(curl -X GET \
    --silent \
    http://localhost:3000/auth/profile \
    -H "Authorization: Bearer $ACCESS_TOKEN")

echo ""
echo "profile 2 : "
echo "$PROFILE"
