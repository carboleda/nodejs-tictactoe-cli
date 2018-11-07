const Utilities = require('../helpers/utilities');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//const Radio = require('prompt-radio');
const SEPTUP = {
    nickName: '',
    matchName: null
};
module.exports = function (socket, options) {
    socket.on('receive available matches', selectMatch);

    async function init() {
        SEPTUP.nickName = await makeQuestion('Nickname: ');
        SEPTUP.createOrJoin = await makeQuestion(`You want to do?
            1. Create new match
            2. Join a game
            `);
        if(SEPTUP.createOrJoin == '1') {
            socket.emit('new match', SEPTUP);
            //rl.close();
            options.onFinish();
        } else {
            socket.emit('get available matches');
        }

        /*askCreateOrJoin()
        .then(createOrJoin => {
            console.log('createOrJoin', createOrJoin);
            socket.emit('get available match');
            return createOrJoin;
        })
        .then((createOrJoin) => {
            rl.close();
        });*/
    }

    async function selectMatch(matches) {
        console.log('selectMatch', matches);
        /*const rbSelectMatch = new Radio({
            name: 'colors',
            message: 'Select match',
            choices: matches
        });
        return rbSelectMatch.run();*/
        const matchesChooise = matches.map((match, index) => `${index + 1}. ${match}`);
        const matchIndex = await makeQuestion(`Select a match:
            ${matchesChooise.join('\n')}
            `);
        SEPTUP.matchName = matches[+matchIndex - 1];
        socket.emit('join to match', SEPTUP);
        //rl.close();
        options.onFinish();
    }

    return {
        init
    };
};

function askCreateOrJoin() {
    const rbCreateOrJoin = new Radio({
        name: 'colors',
        message: 'You want to do?',
        choices: [
            'Create match',
            'Join a game',
        ]
    });
    return rbCreateOrJoin.run();
}

function makeQuestion(q) {
    return new Promise((resolve, reject) => {
        Utilities.clearScreen();
        rl.question(q, answer => {
            resolve(answer);
        })
    });
}