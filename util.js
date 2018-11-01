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

/*const matrix = arrayToMatrix([0,0,1,0,0,2,0,0,3], 3);
console.log(matrix);
console.log(matrixToArray(matrix));*/

module.exports = {
    arrayToMatrix: arrayToMatrix,
    matrixToArray: matrixToArray
};