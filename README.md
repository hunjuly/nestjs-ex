## Description

Describe programming using `nestjs`, `redis`, `grpc`, `typeorm`..

## PlantUML

문서에 사용된 PlantUML을 사용하기 위해서는 아래처럼 서버를 실행해야 한다.

docker run -d --network vscode --restart always --name plantuml plantuml/plantuml-server:jetty

-   .md에 포함된 UML은 @startuml/@enduml 사이에 커서가 위치해야 프리뷰를 볼 수 있다. 한 번 프리뷰가 설정되면 다른 uml이 선택되기 전까지 유지된다.
-   PlantUml설정은 devContainer에 해야한다.

    ```
    {
        "plantuml.render": "PlantUMLServer",
        "plantuml.server": "http://plantuml:8080"
    }
    ```

## Installation

```bash
$ npm install
```

## Running development environment

```bash
npm start
npm test
```

## Debugging

`npm start`로 실행하면 attach process를 할 수 있다.

`unit test`는 vscode의 `code lens` 와 `Jest Runner` extensions이 있으면 'Run|Debug'메뉴가 보인다.

## Production deploy

```bash
# test
$ npm test:all

# build
$ npm run build

# run
$ npm run start:prod
```

## Memories

-   최초 구현은 controller인가? domain인가?\
    DDD는 도메인 주도 디자인일 뿐이다. 구현 순서는 다를 수 있다.\
    항상 실행 가능한 상태를 유지하는 것이 개발에 유리하고 최상위 인터페이스/레이어에서 하향식으로 개발하는 것이 바람직하다.

## Design

-   A simple entity of CRUD uses `Active Record`. Complex entities use the `Data Mapper` style.
-   `src/common` is a common library that can be used in other nestjs projects.
-   Because the DDD uses the 'entity' concept, the `.entity.ts` file created by `nest cli` is changed to `.record.ts` and the class name is also appended with `Record` suffix.\
    The reason for record is that it is information recorded in DB by typeorm.
-   HATEOAS or HAL is implemented in the controller. However, it is not implemented here. Supporting full self descriptives is difficult and complicated. If you really need self description, you can use GRPC as an alternative.

    ```sh
    curl -u admin:admin -X GET "http://localhost:8080/confluence/rest/api/space/ds/content/page?limit=5&start=5"
    ```

    ```json
    {
        "_links": {
            "base": "http://localhost:8080/confluence",
            "context": "",
            "next": "/rest/api/space/ds/content/page?limit=5&start=5",
            "self": "http://localhost:8080/confluence/rest/api/space/ds/content/page"
        },
        "limit": 5,
        "results": [
            {
                "_expandable": {
                    "ancestors": "",
                    "children": "/rest/api/content/98308/child",
                    "history": "/rest/api/content/98308/history",
                    "version": ""
                },
                "_links": {
                    "self": "http://localhost:8080/confluence/rest/api/content/98308",
                    "webui": "/pages/viewpage.action?pageId=98308"
                },
                "id": "98308",
                "status": "current",
                "title": "What is Confluence? (step 1 of 9)",
                "type": "page"
            }
        ],
        "size": 5,
        "start": 0
    }
    ```

-   테스트에서 다른 서비스가 아직 구현되지 않았다면 일단 mock으로 작성하고 서비스가 구현되면 대체한다.
    mock은 건축 과정에서 임시로 설치하는 장치와 같다
