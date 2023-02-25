# Authentication

-   인증은 RefreshToken과 AccessToken 구조
-   RefreshToken 만료는 30일 AccessToken은 10분

## UserID

email은 유니크하기 때문에 userId로 사용해도 될 것 같다.
그러나 email은 사용자와 다르다.\
사용자는 email을 변경할 수 있다. 그러니 userId를 사용해야 한다.
또 oathemail은 중복될 수 있는데

## RefreshTable 구조

```javascript
key = refreshToken
value = {
    userId: 'string',
    email: 'string'
}
```

## AccessToken 구조

```javascript
const accessToken = {
    userId: 'string',
    email: 'string'
}
```

```plantuml
@startuml

actor user
collections users
collections urepo as "users repo"
collections auths
collections arepo as "auths repo"

user -> users: createUser(email,password)
users -> urepo: save(email)
users <-- urepo: userId
users -> auths: createAuth(userId,email,password)
auths -> auths: create hashPassword
auths -> arepo: save(userId,email,\npasswordHash)
users <-- auths: success
user <- users: success
...
user -> auths: login(emial,password)
user <-- auths: refreshToken, accessToken{userId, email}
user -> users: getUser(accessToken)
users -> urepo: findById(userId)
users <-- urepo: user
user <-- users:user
...after 10min, accessToken Expired...
user -> users: getUser(accessToken)
user <-- users:401 Unauthorized
user -> auths: createAccessToken(refreshToken)
user <-- auths: accessToken{userId, email}
user -> users: getUser(accessToken)
users -> urepo: findById(userId)
users <-- urepo: user
user <-- users:user
@enduml
```
