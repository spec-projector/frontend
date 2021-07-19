Firma 
187745-9af4e3c0-f140-43ea-8e92-45ccc8344ee2

// 7d8z_hUSL_9tCh5217Vc

GitLab
3xHME3rNYb6UvHcfz3xh
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

# Using WebP
https://developers.google.com/speed/webp/docs/using

```
brew install webp
cd src/assets/images/lp
cwebp -q 99 welcome.png -o welcome.webp
```
