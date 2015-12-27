
const util = require("util");
const f = util.format;
const IoRedis = require("ioredis");
const value = Symbol();
const redisdb = Symbol();
//const port = 15524;
const port = 6379;
//const host = "pub-redis-15524.us-east-1-4.3.ec2.garantiadata.com";
const host = "localhost";
const family = 4;// 4 (IPv4) or 6 (IPv6)
//const password =  'qDj7aklHFsDVeCG4';
const password =  '';
const db = 0;


function LittleTable(){
    this[value] = undefined;
    this[redisdb] = undefined;
    this.port = port;
    this.host = host;
    this.family =  family;
    this.password = password;
    this.db = db;

    Object.defineProperty( this, "value", {
        enumerable: false,
        get:function(){
            return this.value;
        }
    });
}

LittleTable.prototype.connect = function(){

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

LittleTable.prototype.cellSetter = function( redis,  r, c, v  ){

    var cellname = f("CELL%s:%s", r, c );
    var meta = this.metadata( r, c, v );

    redis.zadd( "row" + r, c, cellname );
    redis.zadd( "col" + c, r, cellname );
    redis.zadd( cellname, meta.date, JSON.stringify( meta  ) );

    return redis;
};

LittleTable.prototype.setCell = function( r, c, v  ){
    return new Promise( function( resolve, reject ) {
        this.cellSetter(  new IoRedis(this).multi(), r, c, v ).exec( function( err, result ) {
            if ( err ){
                reject( err );
            }
            if ( result ){
                resolve(true);
            }
        });
    }.bind(
        LittleTable.prototype.cellGetter = function( redis,  r, c, v  ){

            var cellname = f("CELL%s:%s", r, c );
            var meta = this.metadata( r, c, v );

            redis.zadd( "row" + r, c, cellname );
            redis.zadd( "col" + c, r, cellname );
            redis.zadd( cellname, meta.date, JSON.stringify( meta  ) );

            return redis;
        };
    this ));
};

LittleTable.prototype.getCell = function(){
    var self = this;
    var cells = Array.from( arguments );
    return new Promise( function( resolve, reject ) {
        var m = new IoRediself).multi();



    cells.forEach( f
    cell, 0, 1.zrevrange( args );//needs limit
});

m.exec( function( err, result ){
    console.log("OUT2>>>",err,result)
    if ( err ){
        reject( err );
    }

    if ( result ){
        try {
            var out = [];


            result.forEach( function( r1 ){
                out.push( JSON.parse(  r1[1] ) );
                g("OUT3>>>",out)
                resolve( out );
            } catch( e ){
                console.log("REJECTETD>>>", result)
                reject( e );
            }
        }
    });
});
};

LittleTable.prototype.cell = function( r, c, v ) {
    return new Promise( function( resolve, reject ){
        this.setCell( r, c, v ).then( function(){
            this.getCell( f("CELL%s:%s", r, c ) ).then( function( cells ){
                //                 console.log("---+++>>",cells)
                resolve( cells[0] );
            });
        }.bind( this ) );
    }.bind( this ));
};

LittleTable.prototype.getCellsAs = function( name, start, end ){
    var list = new IoRedis(this).multi();
    return new Promise( function( resolve, reject ){
        list.zrangebyscore( name, start || 0, end || Infinity);
        list.exec( function( err, results ){

            if( err ) {
                reject( err );
            }

            if ( results ){
                resolve( results[0][1] );
            }
        });
    });
};


LittleTable.prototype.col = function( col ){

    return new Promise( function( resolve, reject ){
        var out=[];
        this.getCellsAs( "col" + col ).then( this.getCell.bind(this) ).then( function( data ){

            data.forEach( function( data, i ){
                out[ data.row-1 ] = data.value;
            });

            resolve( out );

        }).catch( function( err ){
            reject( err );
        });
    }.bind( this ));
};

LittleTable.prototype.row = function( row ){
    return new Promise( function( resolve, reject ){
        var out=[];
        this.getCellsAs( "row" + row ).then( this.getCell.bind(this) ).then( function( data ){

            data.forEach( function( data, i ){
                out[ data.col-1 ] = data.value;
            });

            resolve( out );

        }).catch( function( err ){
            reject( err );
        });
    }.bind( this ));
};

LittleTable.prototype.range = function( startRow, startCol, endRow, endCol, version ){

    return new Promise( function( resolve, reject ){

        var p =[];
        for ( var x=startRow-1; x <= endRow-1; x++ ){
            p.push( this.getCellsAs( "row" + x, startCol-1, endCol-1 ) );
        }

        Promise.all( p ).then( function( data ){

            var p2 = this.getCell(...data);

            var matrix=[];
            Promise.all( p2 ).then( function( data ){
                data.forEach( function( vals, i ){
                    var row=[];
                    vals.forEach( function( cell ){
                        row[ cell.col-1 ] = cell.value;
                    });
                    matrix.push( row );
                });

                resolve(99)
            }).catch( function( err ){
                reject( err );
            });

        }.bind( this )).catch( function( err ){
            reject( err );
        });


    }.bind( this ));
};


module.exports = LittleTable;