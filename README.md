# What Can For you？

1. Provide an http intercepting app, which can help you provide mock services when developing locally.
2. It also provides parsing of the golang structure, you can get a json object and mock data through this object
3. Can customize and modify the intercepted response data, and maintain these urls by itself

1. 提供一个http拦截的app，它能帮你在本地开发时提供mock服务。
2. 还提供解析golang结构体，你可以得到一个json对象并通过这个对象进行mock数据
3. 能自定义修改拦截到的响应数据，并自行维护这些url

# This project originated from a whim

What problem did he solve for me?

1. When the backend has not completed the interface development, I need to wait. This is very time-consuming and unnecessary
2. If there is a place, after the back-end has set the data structure and edited it online, the front-end can directly use it and complete the mock data
3. What joy it must be!

1.当后端没有完成接口开发时，我需要等待。这样非常的耗时且没有必要
2. 如果有一个地方，后端定好了数据结构并在线编辑好后，前端可以直接利用它并使用mock数据
3. 那就太爽了！

# How to Run?
```
yarn install:all
yarn dev
```

# Description of project directory

```
http-insepctor-mock
├─ build                                   // electron build packager
├─ client                                  // frontEnd board
│  ├─ .env
│  ├─ package.json
│  ├─ src 
│  ├─ tsconfig.json
│  ├─ vue.config.js
│  └─ yarn.lock
├─ dist                                     // electron dist
├─ server                                   // node server
├─ src
│  ├─ contant
│  │  └─ invoke.ts
│  ├─ data.json
│  ├─ inspect.ts
│  ├─ main.ts                               // build entry
│  ├─ perview.ts                            // dev entry
│  ├─ preload.ts                            // windows inject function
│  └─ shared
│     └─ tools.ts
├─ tsconfig.json
├─ .env                                     // env(port...)
├─ package.json
└─ yarn.lock

```