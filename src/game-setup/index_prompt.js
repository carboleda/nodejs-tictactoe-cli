const Utilities = require('../helpers/utilities');
const Input = require('prompt-input');
const List = require('prompt-list');
let inputNickName;
let lstCreateOrJoin;
let lstSelectMatch;
const SEPTUP = {
    nickName: '',
    matchName: null
};

module.exports = function (socket, options) {
    socket.on('receive available matches', selectMatch);

    async function init() {
        askNickName()
        .then((nickName) => {
            SEPTUP.nickName = nickName;
            return askCreateOrJoin();
        })
        .then((createOrJoin) => {
            if(createOrJoin == 'Create match') {
                //TODO: socket.emit('new match', SEPTUP);
                finishSetup();
            } else {
                socket.emit('get available matches');
            }
        });
    }

    async function selectMatch(matches) {
        Utilities.clearScreen();
        //console.log('selectMatch', matches);
        lstSelectMatch = new List({
            name: 'matches',
            message: 'Select match',
            choices: matches
        });
        SEPTUP.matchName = await lstSelectMatch.run();
        //TODO: socket.emit('join to match', SEPTUP);
        finishSetup();
    }

    function finishSetup() {
        console.log(inputNickName.ui.rl);
        console.log(inputNickName.ui.close(inputNickName.ui.rl));
        /*inputNickName.end();
        lstCreateOrJoin.end();
        if(lstSelectMatch) {
            lstSelectMatch.end();
        }*/
        options.onFinish();
    }

    return {
        init
    };
};

function askNickName() {
    Utilities.clearScreen();
    inputNickName = new Input({
        name: 'nickName',
        message: 'What is your nick name?'
    });
    return inputNickName.run();
}

function askCreateOrJoin() {
    Utilities.clearScreen();
    lstCreateOrJoin = new List({
        name: 'createOrJoin',
        message: `${SEPTUP.nickName}, what do you want to do?`,
        choices: [
            'Create match',
            'Join a game',
        ]
    });
    return lstCreateOrJoin.run();
}