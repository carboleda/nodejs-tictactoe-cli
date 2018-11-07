/*const Radio = require('prompt-radio');
var questions = new Radio({
    name: 'colors',
    message: 'You want to do?',
    default: 'one',
    choices: [
        'one',
        'two',
    ]
});

questions.run()
    .then(function (answers) {
        console.log(answers)
    });*/

var List = require('prompt-list');
var list = new List({
    name: 'order',
    message: 'What would you like to order?',
    // choices may be defined as an array or a function that returns an array
    choices: [
        'Coke',
        'Diet Coke',
        'Cherry Coke',
        { name: 'Sprite', disabled: 'Temporarily unavailable' },
        'Water'
    ]
});

// async
list.ask(function (answer) {
    console.log(answer);
});