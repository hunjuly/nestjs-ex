# Buying Tickets

## Use Case Scenario

https://plantuml.com/ko/sequence-diagram

actor : user
goal : 사용자가 영화 티켓을 구매한다.
preconditions : 사용자는 회원 가입 및 로그인 상태다.
main flow:

1.  사용자가 현재 상영중인 영화를 선택한다.
    -   영화 목록은 주간 순위, 월간 순위, 개봉일자로 정렬된다.
    -   영화를 선택하면 시놉시스, 사용자 후기 등 상세 정보를 볼 수 있다.
    -   검색을 통해서 과거에 상영했던 영화를 볼 수 있다.
1.  극장을 선택한다.
    -   선택한 영화를 상영 중인 극장만 보여준다
    -   사용자의 현재 위치에서 가까운 극장을 추천한다.
    -   반경 5km의 모든 극장. 없으면 가장 가까운 극장 5개
    -   지역을 선택하면 해당하는 극장 전체를 보여준다.
    -   지역은 여러단계로 이루어진다. 극장 목록을 보여주는 것은 마지막 단계다.
1.  상영 시간을 선택한다.
    -   구매 가능한 좌석이 없는 시간은 흐리게 표현한다.
1.  좌석을 선택한다.
    -   좌석은 등급과 종류가 있다.(로얄석, 커플석)
    -   좌석을 선택하면 10분 동안 선점 상태가 된다. 결제를 하기 전에 다른 사용자가 티켓을 구매하는 것을 막는다.
1.  결제한다.
    -   카드결제는 PaymentGateway 서비스를 사용한다.
1.  완료
    -   결제까지 성공하면 구매한 티켓 정보를 보여준다.

exception flow:

-   사용자가 회원 가입 및 로그인 상태가 아니라면, 로그인을 하도록 안내한다.
-   사용자가 선택한 영화가 상영 중이지 않다면, 다른 영화를 선택하도록 안내한다.
-   선택한 극장에서 해당 상영 시간이 없다면, 다른 시간을 선택하도록 안내한다.
-   선택한 좌석이 이미 팔린 경우, 다른 좌석을 선택하도록 안내한다.
-   결제 과정에서 문제가 발생했다면, 사용자에게 에러 메시지를 표시하고 구매를 취소하도록 안내한다.

## Notes

-   TicketsService의 데이터는 `영화수*극장수*좌석수*회차*상영기간` 만큼 생성된다. 엄청나게 많은 데이터다.
-   orderId 리턴할 때 포인트/쿠폰 등 결제 관련 정보도 함께 리턴한다. PointService, CouponService 로 나눌 것인가? 둘은 나누는 것이 좋다. 각각은 성격이 다른 entity이다.
-   이벤트인가? 메소드인가?
    티켓이 업데이트 됐다는 정보는 이벤트로 했다. Statistics에서 사용한다.
    PaymentService는 OrderService와 밀접한 관계가 있어서 직접 호출했다.
    Order와 Ticket도 밀접한 관계가 있기 때문에 직접 호출했다.

```plantuml
@startuml
actor user as "User"
control front as "Front-end"
boundary back as "Back-end"
database movies
database schedules
database theaters
database tickets
database orders
database payments

user -> front: 영화 선택 화면
front -> back: 상영 중인 영화 목록
back -> movies: find(buyable=true)
movies -> schedules: getSchedulesAfter(now)
return schedules[]
note right
Schedule {
    id
    showtime
    theaterId
    movieId
}
end note
movies -> movies: getMovies(schedules[])
back <-- movies: movies[]
note right
Movie {
    id
    title
    plot
    runningTime
    director
    rated
    genre
    releaseDate
}
end note
front <-- back: movies[]
user -> front: 영화 선택(movieId)
front -> back: 극장 목록(movieId, location)
back -> theaters: find(location & distance=near)
back <-- theaters: theaters[]
note right
Theater {
    id
    location
    seats
}
end note
front <-- back: theaters[]
user -> front: 극장 선택(theaterId)
front -> back: 상영일(theaterId,movieId)
back -> schedules: find(theaterId,movieId,group=date)
back <-- schedules: dates[]
note right
[20201230, 20201231]
end note
front <-- back: dates[]
user -> front: 날짜 선택(date)
front -> back: 회차별 예매 상황\n(theaterId,movieId,date)
back -> schedules: find(\n  theaterId &\n  movieId&\n  date&\n  fields=count &\n  group=schedule\n)
schedules -> tickets: find(scheduleIds[] & fields=count\n & group=scheduleId)
return counts{scheduleId, count}[]
back <-- schedules: schedules[]
note right
ScheduleDto {
    ...schedule, saleTicketCount
}
end note
front <-- back: schedules[]
user -> front: 회차 선택(scheduleId)
front -> back: 티켓 목록(scheduleId)
back -> tickets: find(scheduleId & status=sale)
back <-- tickets: tickets[]*(좌석 수 만큼 있다)
note right
Ticket{
    seatId
    status = sold|hold|sale
    grade
    scheduleId
}
end note
front <-- back: 티켓 목록(tickets[])
user -> front: 티켓 선택(ticketIds[])
front -> back: 주문 생성, 티켓(ticketIds[]) 선점
back -> orders: ticketIds[]
tickets <- orders: hold(10min, ticketIds[])
...
orders <-- orders: createOrder():order
back <-- orders: order
front <-- back: order
user -> front: 결제(orderId, coupon, cardInfo)
front -> back: 결제(orderId, coupon, cardInfo)
back -> payments: 결제(orderId, coupon, cardInfo)
orders <- payments: 결제 성공(orderId)
tickets <- orders: paid(ticketId)
tickets ->]: sold tickets
back <-- payments: 결제 성공(orderId)
front <-- back: 결제 성공(orderId)
user <-- front: 구매완료화면
@enduml
```
