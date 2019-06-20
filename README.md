```
npm i
npm start
```

docker pull couchdb
docker run -p 5984:5984 -d couchdb
http://localhost:5984/_utils/


Run space project:

```
npm run space-init
npm run space
npm run space-angular
```

https://junte.gitlab.io/team-projector/spec - specs site

    "space-init": "cp -r lib/space/dist/angular ./dist/space && cd ./space && tsc && cd ../ && cd ./lib/space/src/angular && npm i",
    "model": "./node_modules/.bin/typedoc --out dist/model ./model",



Sprint 3
*  https://gitlab.com/junte/team-projector/backend/issues/80