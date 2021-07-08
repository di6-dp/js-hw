const cnst = value => () => value

const zero = cnst(0)

const one = cnst(1)

const two = cnst(2)

const variables = new Map([
    ["x", 0],
    ["y", 1],
    ["z", 2],
]);

const constants = new Map([
    ["zero", zero],
    ["one", one],
    ["two", two],
]);

const variable = name => (...args) =>
    args[variables.get(name)]

const constructor = func =>
    (...operands) => (...args) =>
        func(...operands.map(operand => operand(...args)))

const add = constructor((a, b) => a + b);

const subtract = constructor((a, b) => a - b);


const multiply = constructor((a, b) => a * b);


const divide = constructor((a, b) => a / b);

const negate = constructor(a => -a);

const min5 = constructor((a, b, c, d, e, ...rest) => Math.min(a, b, c, d, e))

const max3 = constructor((a, b, c, ...rest) => Math.max(a, b, c))

const operations = new Map([
    ["+", add],
    ["-", subtract],
    ["*", multiply],
    ["/", divide],
    ["negate", negate],
    ["min5", min5],
    ["max3", max3],

]);


const numOfArgs = new Map([
    ["+", 2],
    ["-", 2],
    ["*", 2],
    ["/", 2],
    ["negate", 1],
    ["min5", 5],
    ["max3", 3],
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
            stack.push(operations.get(a)(...args));
        } else if (isFinite(a)){
            stack.push(cnst(+a));
        } else if (variables.has(a)){
            stack.push(variable(a));
        } else if (constants.has(a)) {
            stack.push(constants.get(a))
        }
    }
    return stack.pop()
}