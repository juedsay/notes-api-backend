const suma = ( a, b) => {
    return a - b
};

// if (suma(0, 0) !== 0) {
//     new Error('Suma of 0 and 0 expected to be 0')
// };

// if (suma(1, 3) !== 4) {
//     new Error('Suma of 1 and 3 expected to be 4')    
// };

const checks = [
    { a: 0, b:0, result: 0},
    { a: 1, b:3, result: 4},
    { a: -3, b:3, result: 0}
];

checks.forEach(check => {
    const {a, b, result} = check
    console.assert(
        suma(a, b) === result, `Suma of ${a} and ${b} expected to be ${result}`
    );
});

console.log(`${checks.length} checks permormed...`);



