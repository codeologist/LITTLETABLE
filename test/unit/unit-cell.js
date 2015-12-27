
    "use strict";

    const assert = require('assert'),
        DataString = require("../../src/lib/DataString"),
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

            var data = new DataString( "xyz123" );

            assert.equal( data.hash, "2b743ea5699560665032496d957cd8c0075029d5" );
            assert.equal( data.data, "xyz123" );



            done();

        });

        it('should represent BLOB data', function (done) {

            var data = new DataString( { "key1": 123, "key2": true } );

            assert.equal( data.hash, "222398e1b68dce8f01cac03e33698909861144c3" );
            assert.deepEqual( data.data, '{"key1":123,"key2":true}' );



            done();

        });
    });

    describe('Persistance', function() {

        it('should persist string data and load it', function (done) {

            nuke();

            new DataString( "this is some data" ).save( config ).then( function(){

                new DataString( null,"4f84cf87aa25fe0167a10bfa08ba9efd04c16412" ).load( config ).then( function( data ){

                    assert.equal( data.data, "this is some data" );
                    done();

                }).catch( err => console.log( "LOAD ERROR:" + err) );
            }).catch( err => console.log( "SAVE ERROR:" + err) );


        });

        it('should persist blob data and load it', function (done) {

            nuke();

            new DataString( { "title": "this is some blobby data"} ).save( config ).then( function(){

                new DataString( null, "b0014d4cc13fbf50043a4ff51465ba89665ff422" ).load( config ).then( function( data ){

                    var json = JSON.parse( data.data )
                    assert.equal( json.title, "this is some blobby data" );

                    done();

                }).catch( err => console.log( "LOAD ERROR:" + err) );
            }).catch( err => console.log( "SAVE ERROR:" + err) );


        });
    });
