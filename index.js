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
let currentPosition = { x: 1, y: 1 };
const CHARS = {
    GAMER1_A: '[]',
    GAMER1_B: 'OO',
    GAMER2_A: '><',
    GAMER2_B: 'XX',
};
let UNSELECT_POS = '  ';
let GAMER;
let tableData = [];
let previousPosition;
let previousPositionValue;

//https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === 'return') {
        markPosition();
    } else if(['up', 'down', 'left', 'right'].indexOf(key.name) !== -1) {
        movePointer(key.name);
        //console.log(`You pressed the "${str}" key`);
        //console.log(key);
    }
});

//https://gist.github.com/KenanSulayman/4990953
console.reset = function () {
    return process.stdout.write('\033c');
}

function stripColors(str) {
    return str.replace(/\x1B\[\d+m/g, '');
}

function movePointer(key) {
    previousPosition = { ...currentPosition };
    if (key === 'up' && currentPosition.y > 0) {
        currentPosition.y--;
    } else if (key === 'down' && currentPosition.y < 2) {
        currentPosition.y++;
    } else if (key === 'left' && currentPosition.x > 0) {
        currentPosition.x--;
    } else if (key === 'right' && currentPosition.x < 2) {
        currentPosition.x++;
    }

    //Si la anterior y la nueva posición son iguales significa
    //que se intento mover al limite, por lo cual no se hace refresh de la pantalla
    if(currentPosition.x == previousPosition.x && currentPosition.y == previousPosition.y) return;

    if(previousPosition) {
        //Se conserva el valor de la posición antes de calcular el currentPosition
        previousPositionValue = tableData[previousPosition.y][previousPosition.x];
    }

    updateCursor();

    renderTable();
    //module.parent.exports.sendMove(tableData);
}

function updateCursor() {
    //Si la casilla nueva no esta checkeada
    console.log('NEW', currentPosition, tableData[currentPosition.y][currentPosition.x]);
    if(getCheckers().indexOf(tableData[currentPosition.y][currentPosition.x]) === -1) {
        //Asignar el cursor a la posicion actual
        tableData[currentPosition.y][currentPosition.x] = CHARS[`${GAMER}_A`];
    } else if(getHolders().indexOf(tableData[currentPosition.y][currentPosition.x]) !== -1) {
        tableData[currentPosition.y][currentPosition.x] = tableData[currentPosition.y][currentPosition.x];
    } else if(getCheckers().indexOf(tableData[currentPosition.y][currentPosition.x]) !== -1) {
        tableData[currentPosition.y][currentPosition.x] = tableData[currentPosition.y][currentPosition.x].bold.yellow;
    }

    if(previousPosition) {
        console.log('CURRENT', previousPosition, tableData[previousPosition.y][previousPosition.x]);
        if(getHolders().indexOf(tableData[previousPosition.y][previousPosition.x]) !== -1) {
            tableData[previousPosition.y][previousPosition.x] = UNSELECT_POS;
        } else if(getCheckers().indexOf(tableData[previousPosition.y][previousPosition.x]) != -1) {
            console.log('SALIO DE UN POSICION CHECKEADA', tableData[previousPosition.y][previousPosition.x]);
            tableData[previousPosition.y][previousPosition.x] = stripColors(previousPositionValue);
        } else {
            tableData[previousPosition.y][previousPosition.x] = previousPositionValue;
        }
    }
}

function markPosition() {
    tableData[currentPosition.y][currentPosition.x] = CHARS[`${GAMER}_B`];
    renderTable();
    module.parent.exports.sendMove(tableData);
}

function renderTable() {
    console.reset();
    console.log(`Gamer: ${GAMER}`);
    console.log(`Controlls: Cursor: ${CHARS[`${GAMER}_A`]}, Mark: ${CHARS[`${GAMER}_B`]}`);
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    table.splice(0);
    tableData.forEach(row => {
        table.push(row);
    });
    console.log('.:Tres en raya:.');
    console.log(table.toString());
    console.log('Press up, down, left and right keys for move pointer');
}

function updateDataTable(gameMatrix) {
    tableData = gameMatrix;
    renderTable();
}

function showMessage(msg) {
    console.reset();
    console.log(msg.bold.red);
}

function setConfig(config) {
    if(!GAMER) {
        GAMER = `GAMER${config.num}`;
        UNSELECT_POS = `${config.unselect_pos}`;
        tableData = config.game;
        //TODO: tableData[0][0] = `${CHARS[`${GAMER}_A`]}`;
        renderTable();
        //console.log('getHolders', getHolders());
        //console.log('getCheckers', getCheckers());
    }
}

function getHolders() {
    const normal = Object.keys(CHARS)
        .filter(key => key.indexOf('_A') !== -1)
        .map(key => CHARS[key]);
    const colors = normal.map(item => item.bold.yellow);
    return [ ...normal, ...colors ];
}

function getCheckers() {
    const normal = Object.keys(CHARS)
        .filter(key => key.indexOf('_B') !== -1)
        .map(key => CHARS[key]);
    const colors = normal.map(item => item.bold.yellow);
    return [ ...normal, ...colors ];
}

module.exports = {
    updateDataTable,
    setConfig,
    showMessage
}