
    "use strict";

    const assert = require('assert'),
        Data = require("../../src/lib/Data"),
        nuke = require("../../src/lib/nuke");

    const config = {
        port: 6379,
        host: "localhost",
        family:4,
        password:"",
        db:0,
        enableReadyCheck:true,
        enableOfflineQueue:true
    };




    describe('Objects', function() {

        it('should represent STRING data', function (done) {

            var data = new Data( "xyz123" );

            assert.equal( data.hash, "2b743ea5699560665032496d957cd8c0075029d5" );
            assert.equal( data.data, "xyz123" );
            assert.equal( data.length, 6 );
            assert.equal( data.type, "string" );

            done();

        });

        it('should represent BLOB data', function (done) {

            var data = new Data( { "key1": 123, "key2": true } );

            assert.equal( data.hash, "222398e1b68dce8f01cac03e33698909861144c3" );
            assert.deepEqual( data.data, '{"key1":123,"key2":true}' );
            assert.equal( data.length, 24 );
            assert.equal( data.type, "blob" );

            done();

        });
    });

    describe('Persistance', function() {

        it('should persist data and load it', function (done) {

            nuke();

            var data = new Data( "this is some data" );

            data.save( config ).then( function(){

                data.load( config ).then( function( result ){

                    assert.equal( result, "this is some data" );
                    done();
                }).catch( err => console.log(err) );
            }).catch( err => console.log(err) );


        });
    });
