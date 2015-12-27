
    "use strict";

    const IoRedis = require("ioredis");
    const crypto = require('crypto');

    /**
     *
     * DataString object represents a ablob of data.  Its datatype is always string
     * @param data
     *
     */
    function DataString( data, hash ){

        if ( typeof data === "object" ) {
            data = JSON.stringify( data );
        }

        if ( hash ) {
            this.hash = hash;
        } else {
            this.hash = crypto.createHash('sha1').update( data ).digest('hex');
        }

        this.data = data;


    }

    DataString.prototype.loaded = function() {
        return crypto.createHash('sha1').update( this.data ).digest('hex') === this.hash;
    };

    DataString.prototype.save = function( config ) {
        return new Promise( function( resolve, reject ){

            if ( !this.loaded() ){
                reject( new Error( "nothing to save" ) );
            } else {
                var redis = new IoRedis( config );

                redis.hset( "LITTLETABLE:MASTER:DATASTORE", this.hash, this.data, function( err, result ){

                    if ( err ) {
                        reject( err );
                    } else {
                        resolve( result );
                    }

                });
            }
        }.bind( this ) );
    };

    DataString.prototype.load = function( config ){
        return new Promise( function( resolve, reject ){

            if ( this.loaded() ){
                reject( new Error( "already loaded" ) );
            } else {
                
                var redis = new IoRedis( config );
                redis.hget( "LITTLETABLE:MASTER:DATASTORE", this.hash, function( err, result ){

                    if ( err ) {
                        reject( err );
                    }

                    if ( result ){
                        resolve( new DataString( result ) );
                    }
                });
            }

        }.bind( this ));
    };

    module.exports = DataString;