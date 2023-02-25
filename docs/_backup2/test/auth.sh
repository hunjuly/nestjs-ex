# GET /profile
curl http://localhost:3000/profile
# result -> {"statusCode":401,"message":"Unauthorized"}

# create a user
curl -X POST http://localhost:3000/users -d '{"username": "memberA", "role": "member", "email": "memberA@mail.com", "password": "1234"}' -H "Content-Type: application/json"

# login
curl -X POST http://localhost:3000/auths -d '{"email": "memberA@mail.com", "password": "1234"}' -H "Content-Type: application/json"
# result -> {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm... }

# GET /profile using access_token returned from previous step as bearer code
curl http://localhost:3000/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."
# result -> {"userId":1,"username":"john"}
