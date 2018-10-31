//https://github.com/marak/colors.js
var colors = require('colors');
//https://www.npmjs.com/package/node-emoji
var emoji = require('node-emoji')
var Table = require('cli-table');
// instantiate
var table = new Table({
    chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
    },
    colAligns: ['middle', 'middle', 'middle'],
    //colWidths: [20, 20, 20]
});
let currentPosition = { x: 0, y: 0 };
const selectPositionChar = '<>';
const unselectPositionChar = '  ';
const checkedPositionChar = 'X';
const tableData = [
    [selectPositionChar, '  ', '  '],
    ['  ', '  ', '  '],
    ['  ', '  ', '  ']
];

//https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === 'return') {
        markPosition();
    } else {
        movePointer(key.name);
        //console.log(`You pressed the "${str}" key`);
        //console.log(key);
    }
});

//https://gist.github.com/KenanSulayman/4990953
console.reset = function () {
    return process.stdout.write('\033c');
}

function movePointer(key) {
    const prevPosition = { ...currentPosition };
    if (key === 'up' && currentPosition.y > 0) {
        currentPosition.y--;
    } else if (key === 'down' && currentPosition.y < 2) {
        currentPosition.y++;
    } else if (key === 'left' && currentPosition.x > 0) {
        currentPosition.x--;
    } else if (key === 'right' && currentPosition.x < 2) {
        currentPosition.x++;
    }

    //console.log(tableData[currentPosition.y][currentPosition.x]);
    if([checkedPositionChar, `${checkedPositionChar}`.bold.yellow].indexOf(tableData[prevPosition.y][prevPosition.x]) != -1) {
        tableData[prevPosition.y][prevPosition.x] = checkedPositionChar;
    } else {
        tableData[prevPosition.y][prevPosition.x] = unselectPositionChar;
    }

    if([checkedPositionChar, `${checkedPositionChar}`.bold.yellow].indexOf(tableData[currentPosition.y][currentPosition.x]) == -1) {
        tableData[currentPosition.y][currentPosition.x] = selectPositionChar;
    } else {
        tableData[currentPosition.y][currentPosition.x] = `${checkedPositionChar}`.bold.yellow;
    }

    renderTable();
}

function markPosition() {
    tableData[currentPosition.y][currentPosition.x] = checkedPositionChar;
    renderTable();
}

function renderTable() {
    console.reset();
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    table.splice(0);
    tableData.forEach(row => {
        table.push(row);
    });
    console.log('.:Tres en raya:.');
    console.log(table.toString());
    console.log('Turno: Carlos');
    console.log('Press up, down, left and right keys for move pointer');
}

renderTable();