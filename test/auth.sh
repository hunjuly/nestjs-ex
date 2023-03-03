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

# Response status 확인
STATUS=$(echo $SIGNUP | jq -r '.statusCode')

if [ 300 -lt $STATUS -a $STATUS != 409 ]; then
    echo "회원가입 실패"
    exit 1
fi

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

# Refresh Token 추출
REFRESH_TOKEN=$(echo $LOGIN | jq -r '.refreshToken')

if [ -z "$ACCESS_TOKEN" ] || [ -z "$REFRESH_TOKEN" ]; then
    echo $LOGIN
    echo "Error: login fail."
    exit 1
fi

# 2. Access Token을 이용한 profile 요청
PROFILE=$(curl -X GET \
    --silent \
    http://localhost:3000/auth/profile \
    -H "Authorization: Bearer $ACCESS_TOKEN")

USER_ID=$(echo $PROFILE | jq -r '.userId')
EMAIL=$(echo $LOGIN | jq -r '.email')

if [ -z "$USER_ID" ] || [ -z "$EMAIL" ]; then
    echo "$PROFILE"
    echo "Error: USER_ID or EMAIL is null."
    exit 1
fi

# 3. Access Token 재발급 요청
REFRESHED=$(curl -X POST \
    --silent \
    http://localhost:3000/auth/refresh \
    -H 'Content-Type: application/json' \
    -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }')

# Access Token 추출
ACCESS_TOKEN=$(echo $REFRESHED | jq -r '.accessToken')

# Refresh Token 추출
REFRESH_TOKEN=$(echo $REFRESHED | jq -r '.refreshToken')

if [ -z "$ACCESS_TOKEN" ] || [ -z "$REFRESH_TOKEN" ]; then
    echo $REFRESHED
    echo "Error: refresh fail."
    exit 1
fi

# 4. Access Token을 이용한 profile 요청
PROFILE=$(curl -X GET \
    --silent \
    http://localhost:3000/auth/profile \
    -H "Authorization: Bearer $ACCESS_TOKEN")

USER_ID=$(echo $PROFILE | jq -r '.userId')
EMAIL=$(echo $LOGIN | jq -r '.email')

if [ -z "$USER_ID" ] || [ -z "$EMAIL" ]; then
    echo "$PROFILE"
    echo "Error: USER_ID or EMAIL is null."
    exit 1
fi

echo 'AuthModule success'
