//https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
const readline = require('readline');
let isKeypressListenerPaused = false;
module.exports = function(GameBoardScreen, options) {
    function initKeypressListener() {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else if(!isKeypressListenerPaused) {
                if (key.name === 'return') {
                    onMarkPosition();
                } else if(['up', 'down', 'left', 'right'].indexOf(key.name) !== -1) {
                    onMoveCursor(key.name);
                }
            } else {
                GameBoardScreen.drawScreen();
            }
        });
    }

    function pauseKeypressListener() {
        isKeypressListenerPaused = true;
    }

    function resumeKeypressListener() {
        isKeypressListenerPaused = false;
    }

    function onMoveCursor(direction) {
        const cursor = GameBoardScreen.getCursor();
        const gameSize = GameBoardScreen.getGameSize();
        const previousPosition = { ...cursor.currentPosition };
        if (direction === 'left' && cursor.currentPosition.x > 0) {
            cursor.currentPosition.x--;
        } else if (direction === 'right' && cursor.currentPosition.x < gameSize - 1) {
            cursor.currentPosition.x++;
        } else if (direction === 'up' && cursor.currentPosition.y > 0) {
            cursor.currentPosition.y--;
        } else if (direction === 'down' && cursor.currentPosition.y < gameSize - 1) {
            cursor.currentPosition.y++;
        }

        //Si la anterior y la nueva posición son iguales significa
        //que se intento mover al limite, por lo cual no se hace refresh de la pantalla
        if(cursor.currentPosition.x != previousPosition.x
            || cursor.currentPosition.y != previousPosition.y) {
            cursor.previousPosition = previousPosition;
            GameBoardScreen.updateCursor(cursor);
        }
        GameBoardScreen.drawScreen();
    }

    function onMarkPosition() {
        const success = GameBoardScreen.markPosition();
        if(success) {
            options.onMarkPosition();
        }
    }

    return {
        initKeypressListener,
        pauseKeypressListener,
        resumeKeypressListener
    };
}