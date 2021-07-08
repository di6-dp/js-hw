const setMethods = function(clss, evaluate, toString) {
    clss.prototype.evaluate = evaluate;
    clss.prototype.toString = toString;
}

const Const = function(value) {
    this.value = value;
}

setMethods(
    Const,
    function() {
        return this.value;
    },
    function() {
        return "" + this.value;
    }
 )

const Variable = function(name) {
    this.name = name;
}

const variables = new Map([
   ["x", 0],
   ["y", 1],
   ["z", 2]
])

setMethods(
    Variable,
    function(...args) {
        return args[variables.get(this.name)];
    },
    function() {
        return "" + this.name
    }
)

const Operation = function(...args) {
    this.args = args;
}

const operationConstructor = function(symbol, func) {
    const Res = function(...args) {
        Operation.call(this, ...args)
    };
    Res.prototype = Object.create(Operation.prototype);
    Res.prototype.constructor = Res;
    Res.prototype.symbol = symbol;
    Res.prototype.func = func;

    setMethods(
            Res,
            function(...arguments) {
                return this.args.length === 1 ?
                    this.func(this.args[0].evaluate(...arguments)) :
                    this.args.slice(1).reduce((res, current) =>
                        this.func(res, current.evaluate(...arguments)),
                        this.args[0].evaluate(...arguments))

          },
          function() {
              return this.args.reduce((res, current) =>
                              `${res} ${current}`,
                              "").trim() + ` ${this.symbol}`;
          }
       )

    return Res;
}

const Add = operationConstructor("+", (a, b) => a + b)

const Subtract = operationConstructor("-", (a, b) => a - b)

const Multiply = operationConstructor("*", (a, b) => a * b)

const Divide = operationConstructor("/", (a, b) => a / b)

const Negate = operationConstructor("negate", a => 0 - a)

const operations = new Map([
    ["+", Add],
    ["-", Subtract],
    ["*", Multiply],
    ["/", Divide],
    ["negate", Negate],
]);


const numOfArgs = new Map([
    ["+", 2],
    ["-", 2],
    ["*", 2],
    ["/", 2],
    ["negate", 1],
]);

const parse = (string) => {
    let s =  string.trim().split(/\s+/);
    let stack = []
    for (let a of s) {
        if (operations.has(a)) {
            let args = []
            for (let i = 0; i < numOfArgs.get(a); i++) {
                let arg = stack.pop();
                args.unshift(arg)
            }
            const Temp = operations.get(a);
            stack.push(new Temp(...args));
        } else if (isFinite(a)){
            stack.push(new Const(+a));
        } else if (variables.has(a)){
            stack.push(new Variable(a));
        } else if (constants.has(a)) {
            stack.push(constants.get(a))
        }
    }
    return stack.pop()
}