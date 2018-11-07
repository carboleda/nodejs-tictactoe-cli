const Radio = require('prompt-radio');
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
    });