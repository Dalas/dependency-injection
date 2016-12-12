/**
 * Created by yura on 12.12.16.
 */

let expect = require('chai').expect;
let FW = require('../My').MY;


describe('Call dependencies', () => {
    it('We must have capability to call injection', () => {
        FW.define('getOne', () => {
            return 1;
        });

        expect(FW.get('getOne')).to.equal(1);
    })
});

describe('Call dependencies', () => {
    it('We must have capability to call injections', () => {
        FW.define('getTwo', () => {
            return 2;
        });

        expect(FW.get('getOne')).to.equal(1);
        expect(FW.get('getTwo')).to.equal(2);
    })
});

describe('Call dependencies', () => {
    it('We must have capability to call complex injections', () => {
        FW.define('getThree', (getOne, getTwo) => {
            return getOne() + getTwo();
        });

        expect(FW.get('getOne')).to.equal(1);
        expect(FW.get('getTwo')).to.equal(2);
        expect(FW.get('getThree')).to.equal(3);

        FW.define('getFour', (getThree, getOne) => {
            return getThree() + getOne();
        });

        expect(FW.get('getOne')).to.equal(1);
        expect(FW.get('getTwo')).to.equal(2);
        expect(FW.get('getThree')).to.equal(3);
        expect(FW.get('getFour')).to.equal(4);
    })
});

describe('Call dependencies with arguments', () => {
    it('We must have capability to call injections with args', () => {
        FW.define('multiply', (a, b) => {
            return a * b;
        });

        expect(FW.get('multiply', 2, 3)).to.equal(6);
    });

    it('We must have capability to call complex injections with args', () => {
        FW.define('complexInjection', (a, b, getThree) => {
            return (a * b + getThree());
        });

        expect(FW.get('complexInjection', 2, 3)).to.equal(9);
    })
});