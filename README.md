## Description

This document describes programming using nestjs, redis, grpc, and typeorm.

## PlantUML

To use PlantUML in this document, you need to run the server as follows:

```bash
docker run -d --network vscode --restart always --name plantuml plantuml/plantuml-server:jetty
```

-   To preview UML diagrams included in the .md file, place the cursor between @startuml and @enduml. Once the preview is set up, it will persist until a different diagram is selected.

-   PlantUML settings should be set in the devContainer:
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

## Running Development Environment

```bash
npm start
npm test
```

## Debugging

ou can attach a process by running `npm start`.

If you have the `Jest Runner` and `code lens` extensions installed in vscode, you will see the `Run|Debug` menu for `unit tests`.

## Production Deployment

```bash
# test
$ npm test:all

# build
$ npm run build

# run
$ npm run start:prod
```

## Design

-   The `src/common` library is a common library that can be used in other NestJS projects.
-   HATEOAS or HAL is implemented in the controller, but it is not implemented here. Supporting full self-descriptives is difficult and complicated. If you really need self-description, you can use GRPC as an alternative.

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

-   For tests, if other services have not yet been implemented, we write them as mockups and replace them when the services are implemented. Mockups are like temporary devices installed during the construction process.
