

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
};

LittleTable.prototype.Connection = function(){console.log("new connection")
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


LittleTable.prototype.transact = function(){

    var m = this.connection;

    Array.from( arguments ).forEach( function( cmd ){
        m[ cmd[0] ]( ...cmd.slice( 1 ) );
    }.bind( this ));

};


LittleTable.prototype.commit = function(){
    return new Promise( function( resolve, reject ){
        this.connection.exec( function( err, results ){
            this.connection = this.Connection();

            if ( err ){
                reject( err );
            }
            if ( results ){
                resolve( results  );
            }

        }.bind( this ));
    }.bind( this ));
};


LittleTable.prototype.cell = function( row, col, val ){

    var cellname = f("TABLE:CELL:%s:%s", row, col );
    var meta = this.metadata( row, col, val );

    this.transact(
        [ "zadd","TABLE:ROW", row, cellname  ],
        [ "zadd","TABLE:COL", col, cellname ],
        [ "zadd", cellname, meta.date, JSON.stringify( meta )  ]
    );

    this.commit().then( function( result){
        this.transact(
            [ "zrevrange", cellname, 0, 1]
        );
        this.commit().then( function( result ){

        }.bind( this ));
    }.bind( this ));

    return this;
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
LittleTable.prototype.getCells = function( row, col, his ){

    his = his || 0;

    return new Promise( function( resolve, reject ){

        this.commit().then( function( results ){

            var cellname = f("TABLE:CELL:%s:%s", row, col );
            this.transact(
                [ "zrevrange", cellname, 0, 1]
            );

            this.commit().then( function( results ) {console.log("--->",cellname,results)
                resolve( this.clean( results ) );
            }.bind( this )).catch( err => reject( err) );
        }.bind( this )).catch( err => reject( err) );
    }.bind( this ));
};

LittleTable.prototype.getRange = function( rowStart, colStart, rowEnd, colEnd ){

    rowStart = rowStart || 0;
    colStart = colStart || 0;
    rowEnd = rowEnd || rowStart;
    colEnd = colEnd || colStart;

    return this.commit().then( function( results ){

    });
    this.transact(
        [ "zrangebyscore", "row" + row, 0, Infinity ]
    );

    return this.commit().then( function( results ){
        var out = [];
        results.forEach( function( result ){
            if ( Array.isArray( result[1] ) && result[1][0].indexOf("CELL") !== -1){
                out.push( result[1] );
            }
        }, this );

        console.log("---->>>",out)
    }.bind( this ));



};




module.exports = LittleTable;
