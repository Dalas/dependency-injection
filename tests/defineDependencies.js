/**
 * Created by yura on 12.12.16.
 */

let expect = require('chai').expect;
let FW = require('../My').MY;


describe('Define dependencies', function(){
    it('We must have capability to inject dependency', function(){
        FW.define('dependencyOne', () => {
            return 1;
        });

        expect(FW.injections).to.have.property('dependencyOne');
    })
});

describe('Define dependencies', function(){
    it('We must have capability to inject dependencies', function(){
        FW.define('dependencyTwo', () => {
            return 1;
        });

        expect(FW.injections).to.have.property('dependencyOne');
        expect(FW.injections).to.have.property('dependencyTwo');
    })
});