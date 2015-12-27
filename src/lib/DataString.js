
    "use strict";


    const crypto = require('crypto');

    /**
     *
     * DataString object represents a unqiue peice of data.  Its datatype is always string.
     * This object must be memory effiecient as it is the Avatar of the stored data, so could be held
     * in node memory for an unspecified time.
     *
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
    /**
     * A way to tell if this object is yet to be loaded from storage
     * @returns {boolean}
     */
    DataString.prototype.loaded = function() {
        return crypto.createHash('sha1').update( this.data ).digest('hex') === this.hash;
    };

    /**
     * Save the data in a redis hash by passing a pointer to the redis instance
     * @param redis
     * @returns {Promise}
     */
    DataString.prototype.save = function( redis ) {
        return new Promise( function( resolve, reject ){

            if ( !this.loaded() ){
                reject( new Error( "nothing to save" ) );
            } else {

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
    /**
     * load data from a redis instance by passing a pointer to the instance
     * @param redis
     * @returns {Promise}
     */
    DataString.prototype.load = function( redis ){
        return new Promise( function( resolve, reject ){

            if ( this.loaded() ){
                reject( new Error( "already loaded" ) );
            } else {
                

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