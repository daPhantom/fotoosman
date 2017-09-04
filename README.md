# fotoosman

Foto Osman gibt Dir den Kick!

## setup
### server

```
cd server
npm install
npm link ../shared
```

### client

```
cd client
npm install -g browserify
npm install -g watchify
npm install -g http-server
npm install
npm link ../shared
```

### shared

```
cd shared
npm install
```

## running

### server

```
cd server
node app.js --environment=dev
```

### client

```
cd client
npm run build
http-server public/ --cors
```

>   Open 127.0.0.1:8080 in your Internet Explorer
