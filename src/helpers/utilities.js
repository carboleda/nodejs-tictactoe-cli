function arrayToMatrix(array, cols) {
    const matrix = [];
    for(let i=0; i<=array.length-cols; i=i+cols) {
        matrix.push(array.slice(i, i + cols));
    }
    return matrix;
}

function matrixToArray(matrix) {
    return matrix.reduce((array, row) => {
        return [...array, ...row];
    }, []);
}

function stripColors(str) {
    return str.replace(/\x1B\[\d+m/g, '');
}

function getCursors(cursors) {
    const normal = Object.keys(cursors)
        .filter(key => key.indexOf('_CURSOR') !== -1)
        .map(key => cursors[key]);
    const colors = normal.map(item => item.bold.yellow);
    return [ ...normal, ...colors ];
}

function getMarkers(markers) {
    const normal = Object.keys(markers)
        .filter(key => key.indexOf('_MARK') !== -1)
        .map(key => markers[key]);
    const colors = normal.map(item => item.bold.yellow);
    return [ ...normal, ...colors ];
}

/*const matrix = arrayToMatrix([0,0,1,0,0,2,0,0,3], 3);
console.log(matrix);
console.log(matrixToArray(matrix));*/

module.exports = {
    arrayToMatrix,
    matrixToArray,
    stripColors,
    getCursors,
    getMarkers
};