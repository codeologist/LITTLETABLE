
    "use strict";

    var assert = require('assert'),
        LittleTable = require("../src/index");

    const IoRedis = require("ioredis");
    const value = Symbol();
    const redisdb = Symbol();

    const port = 6379;

    const host = "localhost";
    const family = 4;
    const password =  '';
    const db = 0;


    var redis = new IoRedis({
        port: port,
        host: host,
        family: family,
        password: password,
        db: db
    });

    redis.flushall();

    describe('LittleTable', function() {

        it('should set and get distinct cells', function (done) {

            var littleTable = new LittleTable();

            littleTable.cell( 1, 1, "1" ).cell( 5, 5, "2" ).commit().then( function( cells ){
                assert.equal( cells[0].value, "1" );
                assert.equal( cells[1].value, "2" );
                done();
            }).catch( function( err ){
                assert( false, err );
            });
        });

        //it('should return a row', function (done) {
        //
        //    var lt = new LittleTable();
        //    lt.connect();
        //
        //    lt.cell( 5, 1, "3" ).then( lt.cell( 5, 5, "2" ) ).then( function(){
        //
        //        var row = lt.row( 5 );
        //
        //        row.then( function( val){
        //            assert.deepEqual( val, ["3",,,,"2"] );
        //            done();
        //
        //        }).catch( function( err ){
        //            console.log(err );
        //        });
        //    });

        //});
        //
        //it('should return a col', function (done) {
        //
        //    var lt = new LittleTable();
        //    lt.connect();
        //
        //    var col = lt.col( 1 );
        //
        //    col.then( function( val ){
        //        assert.deepEqual( val, ["1",,,,"3"] );
        //        done();
        //
        //    }).catch( function( err ){
        //        console.log(err );
        //    });
        //});


        //it('should return a range', function (done) {
        //
        //    var lt = new LittleTable();
        //    lt.connect();
        //
        //    var p=[];
        //    var ct=1;
        //
        //    for ( var x=1;x<5;x++) {
        //        var q = [];
        //        for ( var y=1;y<5;y++){
        //            q.push(ct);
        //            p.push( lt.setCell( x, y, ct ) );
        //            ct++;
        //        }
        //    }
        //
        //    Promise.all( p ).then( function( cells ){
        //
        //        lt.range( 2, 2, 4, 4 ).then( function( matrix ) {
        //            assert.deepEqual( matrix, [ [ 7, 8, 9 ],[ 12, 13, 14 ],[ 17, 18, 19 ] ] );
        //            done();
        //        }).catch( function( e ){
        //            console.log(e);
        //            assert(false);
        //            done();
        //        });
        //    }).catch( function( e ){
        //        console.log(e);
        //        assert(false);
        //        done();
        //    });
        //});


        //it('should never overwrite, but version, data', function (done) {
        //
        //    var lt = new LittleTable();
        //    lt.connect();
        //
        //    var p=[];
        //    var ct=101;
        //
        //    for ( var x=0;x<5;x++) {
        //        var q = [];
        //        for ( var y=0;y<5;y++){
        //            q.push(ct);
        //            p.push( lt.cell( x, y, ct ) );
        //            ct++;
        //        }
        //        console.log(q)
        //    }
        //
        //    Promise.all( p ).then( function(){
        //
        //        var range = lt.range( 2, 2, 4, 4, 2 ).then( function( matrix ) {
        //            assert.deepEqual( matrix, [ [ 107, 108, 109 ],[ 112, 113, 114 ],[ 117, 118, 119 ] ] );
        //            done();
        //        });
        //
        //    });
        //
        //});

    });
