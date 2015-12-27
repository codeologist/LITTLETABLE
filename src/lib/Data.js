
    "use strict";

    const IoRedis = require("ioredis");
    const crypto = require('crypto');

    /**
     *
     * Data object represents a ablob of data.  Its datatype is always string
     * @param data
     *
     */
    function Data( data ){

        if ( typeof data === "object" ) {
            data = JSON.stringify( data );
            this.type = "blob";
        } else {
            this.type = typeof data;
        }

        this.data = data;
        this.hash = crypto.createHash('sha1').update( this.data ).digest('hex');
        this.length = this.data.length;

    }

    Data.prototype.save = function( config ) {
        return new Promise( function( resolve, reject ){
            var redis = new IoRedis( config );

            redis.hset( "LITTLETABLE:MASTER:DATASTORE", this.hash, this.data, function( err, result ){

               if ( err ) {
                   reject( err );
               } else {
                   resolve( result );
               }

           });
        }.bind( this ) );
    };

    Data.prototype.load = function( config ){
        return new Promise( function( resolve, reject ){
            var redis = new IoRedis( config );
            redis.hget( "LITTLETABLE:MASTER:DATASTORE", this.hash, function( err, result ){

                if ( err ) {
                    reject( err );
                }
                if ( result ){
                    resolve( result );
                }
            });
        }.bind( this ));
    };

    module.exports = Data;