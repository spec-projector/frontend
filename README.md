// 159982-b5f73db8-38e2-480e-849e-01564ec5fdcb
// 7d8z_hUSL_9tCh5217Vc

```
npm i
npm start
```

```
open http://localhost:4200/
{login: breslavsky, password: 229835aA}
```

```
docker pull couchdb  
docker run -p 5984:5984 -d couchdb  
http://localhost:5984/_utils/
```

Run spec project:

```
npm run spec-init
npm run spec
npm run spec-angular
```

https://junte.gitlab.io/team-projector/spec - specs site

    "spec-init": "cp -r lib/spec/dist/angular ./dist/spec && cd ./spec && tsc && cd ../ && cd ./lib/spec/src/angular && npm i",
    "model": "./node_modules/.bin/typedoc --out dist/model ./model",

Sprint 3
*  https://gitlab.com/junte/team-projector/backend/issues/80
