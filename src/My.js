/**
 * This function parse function arguments.
 * @type {function}
 * @param {function} func
 * @returns {Array.<string>}
 * @example getArgs((a) => { return a }) -> ['a']
 */
function getArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg,'')
        .replace(/\s+/g, '')
        .replace(/[/][*][^/*]*[*][/]/g, '')
        .split('){', 1)[0].split(')=>{', 1)[0].replace(/^[^(]*[(]/, '')
        .replace(/=[^,]+/g, '')
        .split(',').filter(Boolean);
}

/**
 * @name MySupperFramework
 */
class MySupperFramework {

    constructor() {
        /**
         * Contains all frameworks injections.
         * @name injections
         */
        this.injections = {};
    }

    /**
     * Wrap injection and returns function that can be called without 'get'.
     * @param {string} name
     * @returns {function(...[*])}
     */
    wrapFunction(name) {
        return (...args) => {
            return this.get(name, ...args)
        }
    }

    /**
     * Define new dependency injection, that can be called using get.
     * @param {string} name
     * @param {function} action
     */
    define (name, action) {
        let _this = this;

        if( !name || !action || typeof name != "string" || typeof action != "function") throw Error("FUCK!");
        if( !!this.injections[ name ] ) throw Error("FUCK!");

        let injections = {};

        // Find and wrap all internal injections
        getArgs(action).forEach(function(arg, index) {
            if (!! _this.injections[ arg ])
                injections[index] = _this.wrapFunction(arg);
        });

        this.injections[ name ] = {
            'action': action,
            'injections': injections
        };
    }

    /**
     * Call injection with arguments {...args} passed after injection name.
     * @param {string} name
     * @returns {*} - result of injection execution
     */
    get (name) {
        if( !this.injections[ name ] ) throw Error("FUCK!");

        let action = this.injections[ name ].action;
        let injections = this.injections[ name ].injections;

        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }

        args = args.splice(1);

        Object.keys(injections).forEach(function(index){
            args.splice(index, 0, injections[index])
        });

        return action.apply(this, args);
    }
}


//let My = new MySupperFramework();

exports.MY = new MySupperFramework();

/*My.define("getOne", () => {
    return 1
});

My.define("getTwo", (getOne, a) => {
    return getOne() * a
});

My.define("getThree", (getTwo, a, b) => {
    return getTwo(a) * b
});


My.define("multiplyOne", (getOne, getThree, a, b) => {
    return getThree(a, a) + b
});


let res = My.get("multiplyOne", 4, 1);
console.log(res);
res = My.get("multiplyOne", 4, 1);
console.log(res);
res = My.get("getTwo", 4);
console.log(res);*/
