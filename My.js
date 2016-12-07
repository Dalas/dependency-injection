function getArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg,'') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
        .split('){', 1)[0].split(')=>{', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
        .replace(/=[^,]+/g, '') // strip any ES6 defaults
        .split(',').filter(Boolean); // split & filter [""]
}

class MySupperFramework {
    constructor() {
        this.injections = {};
    }

    wrapFunction(name) {
        let _this = this;

        return function() {
            return _this.get(name, ...arguments)
        }
    }


    define (name, action) {
        let _this = this;

        if( !name || !action || typeof name != "string" || typeof action != "function") throw Error("FUCK!");
        if( !!this.injections[ name ] ) throw Error("FUCK!");

        let injections = {};

        getArgs(action).forEach(function(arg, index) {
            if (!! _this.injections[ arg ])
                injections[index] = _this.wrapFunction(arg);//_this.wrapFunction( _this.injections[ arg ].action );
        });

        this.injections[ name ] = {
            'action': action,
            'injections': injections
        };
    }

    get (name) {
        if( !this.injections[ name ] ) throw Error("FUCK!");

        let action = this.injections[ name ].action;
        let injections = this.injections[ name ].injections;

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }

        args = args.splice(1);

        Object.keys(injections).forEach(function(index){
            args.splice(index, 0, injections[index])
        });

        return action.apply(this, args);
    }
}


let My = new MySupperFramework();

My.define("getOne", () => {
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
console.log(res);
