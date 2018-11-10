const Utilities = require('../helpers/utilities');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const SEPTUP = {
    nickName: '',
    matchName: null
};
module.exports = function (socket, options) {
    socket.on('receive available matches', selectMatch);

    async function init() {
        SEPTUP.nickName = await makeQuestion('Nickname:');
        SEPTUP.createOrJoin = await makeQuestion(`${SEPTUP.nickName}, what do you want to do?`, [
            '1. Create new match',
            '2. Join a game'
        ]);
        if(SEPTUP.createOrJoin == '1') {
            socket.emit('new match', SEPTUP);
            options.onFinish();
        } else {
            socket.emit('get available matches');
        }
    }

    async function selectMatch(matches) {
        const matchesChooise = matches.map((match, index) => `${index + 1}. ${match}`);
        const matchIndex = await makeQuestion(`Select a match:`, matchesChooise);
        SEPTUP.matchName = matches[+matchIndex - 1];
        socket.emit('join to match', SEPTUP);
        options.onFinish();
    }

    return {
        init
    };
};

function makeQuestion(question, choices = []) {
    return new Promise((resolve, reject) => {
        Utilities.clearScreen();
        const breakLine = choices.length > 0 ? '\n' : ' ';
        const questionAndChoices = `${question}${breakLine}${choices.join('\n')}${breakLine}`;
        rl.question(questionAndChoices, answer => {
            resolve(answer);
        });
    });
}