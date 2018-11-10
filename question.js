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

/*var List = require('prompt-list');
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
});*/

/*var Input = require('prompt-input');
var input = new Input({
    name: 'first',
    message: 'What is your name?'
});

// promise
input.run()
    .then(function (answers) {
        console.log(answers);
    });*/


var Enquirer = require('enquirer');
var enquirer = new Enquirer();
var questions = [
    {
        type: 'input',
        name: 'first',
        message: 'What is your name?'
    },
    {
        type: 'list',
        name: 'order',
        message: 'What would you like to order?',
        choices: [
            'Coke',
            'Diet Coke',
            'Cherry Coke',
            { name: 'Sprite', disabled: 'Temporarily unavailable' },
            'Water'
        ]
    }
];

enquirer.register('list', require('prompt-list'));

enquirer.prompt(questions)
    .then(function (answers) {
        console.log(answers)
    });
