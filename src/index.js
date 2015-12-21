

    "use strict";

    const util = require("util");
    const f = util.format;
    const IoRedis = require("ioredis");
    const config = {
        port: 6379,
        host: "localhost",
        family:4,
        password:"",
        db:0
    };


    function LittleTable(){
        this.connection = this.Connection();
    }

    LittleTable.prototype.Connection = function(){
        return new IoRedis( config ).multi();
    };

    LittleTable.prototype.Cell = function( metadata ){
        this.value = metadata.value;
    };


    LittleTable.prototype.metadata = function( row, col, val ){
        return {
            value: val,
            type:  typeof val,
            row:   row,
            col:   col,
            date:  new Date().getTime()
        };
    };

    LittleTable.prototype.transact = function(){

        var m = this.connection;

        Array.from( arguments ).forEach( function( cmd ){
            m[ cmd[0] ]( ...cmd.slice( 1 ) );
        }.bind( this ));

    };

    LittleTable.prototype.clean = function( results ){
        var out = [];
        results.forEach( function( result ){
            if ( Array.isArray( result[1] ) ){
                out.push( new this.Cell( JSON.parse( result[1][0] ) ) );
            }
        }, this );


        return out;
    };

    LittleTable.prototype.commit = function(){
        return new Promise( function( resolve, reject ){
            this.connection.exec( function( err, results ){
                this.connection = this.Connection();


                if ( err ){
                    reject( err );
                }
                if ( results ){
                    resolve( this.clean( results ) );
                }

            }.bind( this ));
        }.bind( this ));
    };


    LittleTable.prototype.cell = function( row, col, val ){

        var cellname = f("CELL%s:%s", row, col );
        var meta = this.metadata( row, col, val );

        this.transact(
            [ "zadd","row" + row, col, cellname  ],
            [ "zadd","col" + col, row, cellname ],
            [ "zadd", cellname, meta.date, JSON.stringify( meta )  ]
        );

        this.transact(
            [ "zrevrange", cellname, 0, 1 ]
        );

        return this;
    };


    module.exports = LittleTable;
