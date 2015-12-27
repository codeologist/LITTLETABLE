

    "use strict";

    const IoRedis = require("ioredis");
    const config = {
        port: 6379,
        host: "localhost",
        family:4,
        password:"",
        db:0
    };


    function NUKE(){
        return new IoRedis( config ).flushall();
    }

    module.exports = NUKE;