const config = require('../../config/config.json');
const colors = require('colors');
const axios = require('axios');
const Table = require('cli-table');
const { GAMER_CHAR, GAME_STATE } = require('../helpers/constants');
const Utilities = require('../helpers/utilities');
const historyMatches = new Table(config.matches);

function drawHeader(nickName) {
    try {
        console.log('..::Tic Tac Toe::..'.bold.green);
        console.log('Gamer Nick:'.bold, nickName.bold.blue);
    } catch(e) {}
}

function drawFooter() {
    try {
        console.log('How to use it?'.bold);
        console.log('* Press up, down, left and right keys for move cursor');
        console.log('* Press enter for mark a position');
        console.log('* Press ctrl + c to exit');
    } catch(e) {}
}

function drawHistoryTable(matches) {
    Utilities.clearScreen();
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    // Se eliminan todo el contenido del historyMatches
    historyMatches.splice(0);
    matches.forEach(match => {
        const wpMatrix = match.winningPlay
            .map(pos => Utilities.arrayIndexToMatrixIndex(pos, match.boardSize))
            .map(pos => `${pos.y},${pos.x}`);
        historyMatches.push([
            new Date(match.createdAt).toDateString(),
            match.opponentNickName,
            match.boardSize,
            wpMatrix.join(' / ')
        ]);
    });
    console.log('');
    console.log(historyMatches.toString());
    console.log('');
}

function drawScreen(nickName, matches) {
    Utilities.clearScreen();
    drawHeader(nickName);
    drawHistoryTable(matches);
    drawFooter();
}

function showHistoryMatches(nickName) {
    axios({
        method: 'GET',
        url: `${config.server}/player/matches/${nickName}`
    })
    .then((res) => {
        drawScreen(nickName, res.data);
    })
    .catch((reason) => {
        //console.error(reason.response.data);
        console.error(reason);
    });
}

module.exports = {
    showHistoryMatches
};