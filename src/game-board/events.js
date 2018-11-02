module.exports = function(Screen, options) {
    function initKeypressListener() {
        //https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
        const readline = require('readline');
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else if (key.name === 'return') {
                onMarkPosition();
            } else if(['up', 'down', 'left', 'right'].indexOf(key.name) !== -1) {
                onMoveCursor(key.name);
            }
        });
    }

    function onMoveCursor(direction) {
        const cursor = Screen.getCursor();
        const previousPosition = { ...cursor.currentPosition };
        if (direction === 'left' && cursor.currentPosition.x > 0) {
            cursor.currentPosition.x--;
        } else if (direction === 'right' && cursor.currentPosition.x < 2) {
            cursor.currentPosition.x++;
        } else if (direction === 'up' && cursor.currentPosition.y > 0) {
            cursor.currentPosition.y--;
        } else if (direction === 'down' && cursor.currentPosition.y < 2) {
            cursor.currentPosition.y++;
        }

        //Si la anterior y la nueva posición son iguales significa
        //que se intento mover al limite, por lo cual no se hace refresh de la pantalla
        if(cursor.currentPosition.x == previousPosition.x
            && cursor.currentPosition.y == previousPosition.y) return;

        cursor.previousPosition = previousPosition;

        Screen.updateCursor(cursor);
        Screen.drawScreen();
    }

    function onMarkPosition() {
        Screen.markPosition();
        Screen.drawScreen();
        options.onMarkPosition();
    }

    return {
        initKeypressListener
    };
}