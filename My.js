// Parse function and return function arguments
function getArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg,'')
        .replace(/\s+/g, '')
        .replace(/[/][*][^/*]*[*][/]/g, '')
        .split('){', 1)[0].split(')=>{', 1)[0].replace(/^[^(]*[(]/, '')
        .replace(/=[^,]+/g, '')
        .split(',').filter(Boolean);
}

// Example object
class MySupperFramework {
    constructor() {
        this.injections = {};
    }

    /* Wrapper function.
     *
     * Takes name of injection
     * Return wrapped function that can be called
     */
    wrapFunction(name) {
        return (...args) => {
            return this.get(name, ...args)
        }
    }

    /* Define function.
     *
     * Takes name of injection and injection function
     * Add injection to frameworks injection container and wrap all internal injections
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

    /* Call injection.
     *
     * Takes name of injection and all other arguments
     * Return result of injections execution with arguments
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
