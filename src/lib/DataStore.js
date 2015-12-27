
    "use strict";

    const IoRedis = require("ioredis");
    const DATASTORE = "LITTLETABLE:MASTER:DATASTORE";
    const config = {
        port: 6379,
        host: "localhost",
        family:4,
        password:"",
        db:0,
        enableReadyCheck:true,
        enableOfflineQueue:true
    };
    var redis = new IoRedis( config );

    function DataStore(){
    }

    DataStore.prototype.saveChunk = function( data, hash, callback ){
        redis.hset( DATASTORE, hash, data, callback );
    };

    DataStore.prototype.loadChunk = function( hash, callback ){
        redis.hget( DATASTORE, hash, callback );
    };

    module.exports = DataStore;