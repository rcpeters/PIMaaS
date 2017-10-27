# bigchaindb

## Dev setup

1. Install bigchaindb instance. Mongo db backend is suggested.
   
    * Install for OSX [https://docs.bigchaindb.com/projects/server/en/latest/appendices/docker-on-mac.html](https://docs.bigchaindb.com/projects/server/en/latest/appendices/docker-on-mac.html)
    * Install for linux desktop [https://docs.bigchaindb.com/projects/server/en/latest/appendices/run-with-docker.html](https://docs.bigchaindb.com/projects/server/en/latest/appendices/run-with-docker.html)

After you get it working common docker commands

   * docker start bigchaindb

   * docker stop bigchaindb

   *  ssh into mongo docke instance, after which you can run mongo command
      `docker exec -it mongodb /bin/bash`

   

2. Install node dependencies

    1. Install node [https://nodejs.org/en/download/](https://nodejs.org/en/download/) or verify you are upto date with `npm install -g n 2 npm cache clean -f`

    2. cd to project root and  run `npm install`

    3. in the directory you'lll seem small scripts testing how to use bigchaindb. Run them with node or nodemon for example `node testBigChainDB.js`.
