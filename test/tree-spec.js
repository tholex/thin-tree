'use strict';
var _ = require('lodash');

var utils = require('./utils');
var expect = utils.expect;

var TT = require('../');

describe('Thin Tree', function() {
    var raw = {};
    beforeEach(function() {

    });

    it('should create a tree', function() {
        var tree = new TT({
            name: "Eve",
            children: [
                {
                    name: "Alice"
                }
            ]
        });
        expect(tree.name).to.equal("Eve");
        expect(tree.children).to.be.array;
        expect(tree.children[0].name).to.equal("Alice")
    });

    describe('Inheritance', function() {
        var First, Second, Third;
        beforeEach(function() {
            First = TT.extend({
                type: 'first',
                first: true,
                initialize: function() {
                    this.inheritted = "roar" + Math.random();
                    this.beforeInit = "first";
                    First.__super__.initialize.call(this);
                    this.afterInit = "first";
                },
                getType: function() {
                    return this.type;
                }
            });


            Second = First.extend({
                type: 'second',
                second: true,
                initialize: function() {
                    this.beforeInit = "second";
                    Second.__super__.initialize.call(this);
                    this.afterInit = "second";
                },
                getType: function() {
                    return [this.type, Second.__super__.getType()].join(':');
                    // return this.type + (this.super().getType())
                }
            });

        });

        it('should inherit parents methods', function() {
            var first = new First();
            expect(first.constructor.__super__).to.equal(TT.prototype);
            expect(first.getType()).to.equal('first')
        });

        it('should inherit ancestor methods', function() {
            var second = new Second();
            expect(second.__super__).to.equal(First.prototype);
            expect(second.__super__.__super__).to.equal(TT.prototype);

            expect(second.type).to.equal('second');
            expect(second.__super__.type).to.equal('first');
            expect(second.__super__.__super__.type).to.be.undefined
            expect(second.beforeInit).to.equal("first");
            expect(second.afterInit).to.equal("second");


            expect(second.__model__).to.equal(Second);
            expect(second.__super__).to.equal(First.prototype);
            expect(second.__super__.__model__).to.equal(First);
            expect(second.__super__.__super__).to.equal(TT.prototype);
            expect(second.__super__.__super__.__model__).to.be.undefined

            expect(second.getType()).to.equal("second:first");
            expect(second.__super__.getType()).to.equal("first");
        })

    });
});

describe('Find Tree', function() {
    var raw = {};
    beforeEach(function() {

    });

    it('should create a tree', function() {
        var tree = new TT.Find({
            name: "Eve",
            children: [
                {
                    name: "Alice"
                }
            ]
        });
        expect(tree.name).to.equal("Eve");
        expect(tree.children).to.be.array;
        expect(tree.children[0].name).to.equal("Alice")
    });
});