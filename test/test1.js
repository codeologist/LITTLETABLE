
    "use strict";

    var assert = require('assert'),
        LittleTable = require("../src/index");



    describe('LittleTable', function() {

        it('should return undefined for an empty cell, row, col', function (done) {

            var lt = new LittleTable();

            assert.equal( lt.cell( 1, 1 ), undefined );
            assert.equal( lt.row( 1 ), undefined );
            assert.equal( lt.col( 1 ), undefined );
            assert.equal( lt.range( 1,1,10,10 ), undefined );

            done();

        });
    });
