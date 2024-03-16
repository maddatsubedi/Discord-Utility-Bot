const data = [
    [
        'test2',
        '1204716718984011777',
        '1205921197334728715',
        'Sat, 10 Feb 2024 17:00:01 GMT'
    ]
];

const check = data.find((row) => row[1] == 1204716718984011777);
const rowsToRemove = data.filter(row => row[1] == 1204716718984011777);

console.log(check);
console.log(rowsToRemove);