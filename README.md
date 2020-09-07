# CharityChain

This project is a web demo for *Charitychain* based on Bootstrap,Node.js,Express,MongoDB,Quorum blockchain,Solidity contracts. Include a donation platform and a blockchain  network supported by Azure blockchain services.

## 一、Deploy Environment

**1. Software Requirements**： Node.js + Express( a framework for Node.js )+ MongoDB+ Quorum blockchain

**2. Download & Add Environment Path：**

- Download Node.js - v12.15.0 : https://nodejs.org/download/release/v12.15.0/
- Download MongoDB - v3.2.22 : https://www.mongodb.com/download-center/community
- Download Python 3.7: https://www.python.org/downloads/release/python-371/
- Add three installation paths to System Environment Variables.

**3. Start up MongoDB**

1. Open a command window and switch to the "bin" directory under the mongodb installation directory

   ```
   F:
   cd mongodb-win32-x86_64-2008plus-ssl-3.2.22\bin
   ```

2. Create storage path(data path and log path) to store MongoDB data and log（for the first time）

   ```
   cd ..\
   mkdir data\log
   cd data\log
   type nul>mongodb.log           //create log file is necessary otherwise an error
   ```

3. Start up MongoDB Server

   ```
   cd ..\..\bin
    mongod --dbpath F:\mongodb-win32-x86_64-2008plus-ssl-3.2.22\data
   ```
   
**4. migrate smart contract to Quorum blockchain**


## 二、Project structure

![tree](https://github.com/CassieJie/learngit/blob/master/Project_voc/tree.jpeg)

- **Entry file**: app.js

- **route directory**: src/routers

- **smart contract in blockchain**: contract

- **deploy to Azure web service**: deploy.js(npm run deploy)

  

## 三、Install project

**1. Install npm dependencies**

```
cd Charitychain
npm install
npm start
```


## 四、Project Preview

```
open browser and input URL:

http://localhost:8080/
```

