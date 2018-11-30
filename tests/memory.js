/* * * * * * * * * * *
 * Variables
 * * * * * * * * * * */
let gameBoard = document.getElementById('game'),
    userSelection = [],
    cards = [
        {
            id: 1,
            path: "potionRed",
        },
        {
            id: 2,
            path: "potionRed",
        },
        {
            id: 3,
            path: "upg_shield",
        },
        {
            id: 4,
            path: "upg_shield",
        },
        {
            id: 5,
            path: "bow",
        },
        {
            id: 6,
            path: "bow",
        },
        {
            id: 7,
            path: "axeDouble2",
        },
        {
            id: 8,
            path: "axeDouble2",
        },
        {
            id: 9,
            path: "backpack",
        },
        {
            id: 10,
            path: "backpack",
        },
        {
            id: 11,
            path: "sword",
        },
        {
            id: 12,
            path: "sword",
        },
        {
            id: 13,
            path: "scroll",
        },
        {
            id: 14,
            path: "scroll",
        },
    ],
    rand,
    cardIsClicked = false,
    shuffled = shuffle(cards),
    cardsDiv = document.getElementsByClassName('card'),
    difficultyWrapper = document.getElementById('difficulty-settings-wrapper'),
    difficultyButtons = document.getElementsByClassName('difficultyButton'),
    timerDiv = document.getElementById('timer'),
    scoreBoard = document.getElementById('score-wrapper');



/* * * * * * * * * * *
 * Creates html elements from randomized array of objects
 * * * * * * * * * * */
function prepareBoard(arrayObj)
{
    for (let i = 0; i < arrayObj.length; i++)
    {
        let card = document.createElement('div'),
            img = document.createElement('img');

        card.classList.add('card');
        card.id = arrayObj[i].id;
        card.setAttribute('data-path', arrayObj[i].path);

        img.src = `../assets/${arrayObj[i].path}.png`;
        img.style.display = "none";

        card.appendChild(img);

        gameBoard.appendChild(card);
    }
}


/* * * * * * * * * * *
 * Generates random integer based on the maximuum number given in parameter
 * Returns a number
 * * * * * * * * * * */
function randomNumber(maxLength)
{
    return Math.floor(Math.random() * maxLength);
}


/* * * * * * * * * * *
* Shuffles the array it receives as a parameter into a new temporary array then returns it
* * * * * * * * * * */
function shuffle(param)
{
    let temp = [];

    for (let i = 0; i < param.length; i++)
    {
        rand = randomNumber(param.length);
        if (temp.indexOf(param[rand]) === -1)
        {
            temp.push(param[rand]);
        } else {
            i--;
        }
    }
    return temp;
}


/* * * * * * * * * * *
* Cards event listeners, handles comparisons and calls for animations
* to be played and score to be displayed
* * * * * * * * * * */
function createCardListeners()
{

    for (let i = 0; i < cardsDiv.length; i++)
    {
        cardsDiv[i].addEventListener('click', function(e)
        {
            if (Game.isRunning && !cardIsClicked)
            {
                cardIsClicked = true;
                let target = e.target;

                // Only executes if the card clicked on wasn't already selected
                if (target.tagName === "DIV" && !target.classList.contains('flipped')) {
                    if (userSelection.length < 2) {
                        Animator.flip(target);
                        userSelection.push(target);
                    }

                    if (userSelection.length === 2) {
                        let firstChoice = userSelection[0],
                            secondChoice = userSelection[1];

                        if (firstChoice.id === secondChoice.id) {
                            userSelection.pop();
                            return;
                        }

                        if (firstChoice.getAttribute('data-path') === secondChoice.getAttribute('data-path') && firstChoice.id !== secondChoice.id) {
                            Game.score++;
                            firstChoice.style.borderStyle = "solid";
                            secondChoice.style.borderStyle = "solid";

                            if (Game.score === cards.length / 2) {
                                Game.win(Timer.getTimeLeft());
                            }
                            userSelection = [];
                        } else {
                            Animator.flipBack(firstChoice, target);
                        }
                    }
                }
            }

            setTimeout(function()
            {
                cardIsClicked = false;
            }, 400);
        });
    }
}


/* * * * * * * * * * *
*  Creation of listeners attached to the difficulty buttons and calls for Game.start()
* * * * * * * * * * */
function createButtonListeners()
{

    for (let i = 0; i < difficultyButtons.length; i++)
    {
        difficultyButtons[i].addEventListener('click', function(e)
        {
            if (!Game.isRunning)
            {
                Timer.init(e.target.id);
                Game.start();
            }
        });
    }

    document.getElementById('replay').addEventListener('click', function() {
        Game.restart();
    });
}

/* * * * * * * * * * *
* Responsible for handling all the animations
* * * * * * * * * * */
let Animator = {

    flip: function(card)
    {
        card.classList.add('flipped');
        setTimeout(function()
        {
            //card.classList.add(card.getAttribute('data-path'));
            card.firstChild.style.display = "block";
        }, 100);
    },

    flipBack: function(firstChoice, target)
    {
        setTimeout(function() {
            firstChoice.className = "card";
            target.className = "card";

            firstChoice.firstChild.style.display = "none";
            target.firstChild.style.display = "none";

            userSelection = [];
        }, 600);
    },

    displayBoard: function()
    {
        difficultyWrapper.classList.add('difficultySettingsToLeft');
        gameBoard.classList.add('gameBoardToLeft');
    },

    displayScore: function()
    {
        gameBoard.classList.remove('gameBoardToLeft');
        gameBoard.classList.add('gameBoardToLeftMost');

        scoreBoard.classList.add('scoreBoardToLeft');
    },

    restart: function()
    {
        scoreBoard.classList.add('resetScoreBoard');
        gameBoard.classList.add('resetGameBoard');

        setTimeout(function() {
            difficultyWrapper.classList.remove('difficultySettingsToLeft');
            difficultyWrapper.classList.add('resetDifficultyWrapper');
        }, 500);

        setTimeout(function() {
            gameBoard.className = "";
            scoreBoard.className = "";
            difficultyWrapper.className = "";
        }, 800);
    }
};


/* * * * * * * * * * *
* Responsible for running and displaying the timer based on difficulty setting
* * * * * * * * * * */
let Timer = {
    selectedDifficulty: null,
    timeLeft : null,
    chrono : null,

    init: function (value) {
        Timer.selectedDifficulty = value;
    },

    start: function () {
        switch (Timer.selectedDifficulty) {
            case "easy":
                Timer.runFor(300); // 5 minutes
                break;
            case "medium":
                Timer.runFor(150); // 2mins30
                break;
            case "hard":
                Timer.runFor(60); // 1 minutes
                break;
            default:
                Timer.runFor(180);
        }
    },

    runFor: function(time)
    {

        Timer.timeLeft = time;
        Timer.display(Timer.timeLeft);

        function loop()
        {
            Timer.chrono = setTimeout(function() {
                Timer.timeLeft--;
                Timer.display(Timer.timeLeft);
                if (Timer.timeLeft > 0)
                {
                    loop();
                } else if (Timer.timeLeft === 0)
                {
                    Game.timeRanOut();
                }
            }, 1000);
        }

        loop();
    },

    display: function(timeLeft)
    {
        let minutes = Math.floor(timeLeft / 60),
            seconds = Math.floor(timeLeft % 60);

        minutes = minutes < 10 && minutes > 0 ? `0${minutes}`: minutes;
        seconds = seconds < 10 && seconds > 0 ? `0${seconds}`: seconds;

        minutes = minutes === 0 ? '00' : minutes;
        seconds = seconds === 0 ? '00' : seconds;

        timerDiv.innerHTML = `${minutes} : ${seconds}`;
    },

    getTimeLeft: function()
    {
        let minutes = Math.floor(Timer.timeLeft / 60),
            seconds =  Math.floor(Timer.timeLeft % 60);

        return [minutes, seconds];
    }


};


/* * * * * * * * * * *
* Responsible for starting/stopping the game and displaying scores
* * * * * * * * * * */
let Game = {

    isRunning : false,
    score : 0,


    timeRanOut: function()
    {
        clearTimeout(Timer.chrono);
        Timer.chrono = null;
        Game.gameOver("timer");
    },

    win: function(timeLeft)
    {
        clearTimeout(Timer.chrono);
        Timer.chrono = null;
        Game.gameOver("win", timeLeft);
    },

    gameOver: function(reason, timeLeft = null)
    {
        Game.isRunning = false;
        Animator.displayScore();

        switch(reason) {
            case "timer":
                document.getElementById('result').innerHTML = "Dommage!";
                document.getElementById('timeLeft').innerHTML = "Tu es à court de temps";
                document.getElementById('pairs-found').innerHTML = `Tu as trouvé ${Game.score} ${Game.score === 1 ? "paire" : "paires"}`;
                break;
            case "win":
                document.getElementById('result').innerHTML = "Félicitations!";
                document.getElementById('timeLeft').innerHTML = `Temps restant: ${timeLeft[0] <= 1 ? "" :  timeLeft[0] + "mins et "} ${timeLeft[1]} secondes`;
                document.getElementById('pairs-found').innerHTML = `Tu as trouvé toutes les paires!`;
        }
    },

    start: function()
    {
        while (gameBoard.children.length > 1)
        {
            gameBoard.removeChild(gameBoard.lastChild);
        }

        shuffled = shuffle(cards);
        Game.isRunning = true;
        prepareBoard(shuffled);
        createCardListeners();
        Animator.displayBoard();
        Timer.start();
    },

    restart: function()
    {
        Game.isRunning = false;
        Timer.timeLeft = 0;
        Timer.chrono = null;
        Timer.selectedDifficulty = null;
        userSelection = [];
        Game.score = 0;
        Animator.restart();
    }
};


/* Selecting a difficulty setting calls for Game.start() */
createButtonListeners();



/* * * * * * * * * * *
* Tests
* * * * * * * * * * */


if (window.location.href === 'https://anomalous-headset.000webhostapp.com/memory/memory-tests.html')
{

    document.getElementById('title').innerHTML = "TESTS";
    document.getElementById('infos').innerHTML = "Le résultat des tests est affiché dans la console";

    let test = 5;

// randomNumber test
    setTimeout(function() {
        (function(test) {

            let temp = randomNumber(test);

            console.log(
                temp >= 0 && temp <= 5 ? `randomNumber(5) test PASSED (number: ${temp})` : `randomNumber test FAILED (number: ${temp})`
            );
        })(test);

// Shuffle test
        test = [1, 2, 3, 4, 5, 6];

        (function(test) {

            let temp = shuffle(test),
                result = [
                    test.join(''),
                    temp.join('')
                ];

            console.log(
                result[0] !== result[1] ? `shuffle test PASSED ${result[0]} / ${result[1]}` : `suffle test FAILED ${result[0]} / ${result[1]}`
            );
        })(test);

// Difficulty buttons test
        test = 'hard';

        (function(test) {
            // Checks if board loads properly
            let boardChildren = gameBoard.childNodes,
                before = boardChildren.length,
                after;

            console.log(
                '**** Difficulty buttons test *****\n' +
                `Before selecting a difficulty: gameBoard children count = ${before} (timer node)`
            );

            document.getElementById(test).click();
            Timer.timeLeft = 3;

            after = boardChildren.length;
            console.log(
                `Simulating selection of difficulty: gameBoard children count = ${after} (timer node + cards)` +
                `\n${before === 1 && after === 15 ? 'Difficulty buttons test PASSED' : 'Difficulty buttons test FAILED'}`
            );
        })(test);

// Reset button test
        test = 'replay';

        setTimeout(function(){
            (function(test) {

                let scoreBefore,
                    scoreAfter,
                    difficulty = Timer.selectedDifficulty,
                    pair = [document.getElementById('1'), document.getElementById('2')];

                pair[0].click();

                setTimeout(function() {
                    pair[1].click();
                }, 500);

                setTimeout(function() {
                    scoreBefore = Game.score;
                    console.log(
                        '******* Reset button test *******\n' +
                        `Simulating player finding a pair. Score : ${scoreBefore}, difficulty: ${difficulty} `
                    );
                }, 600);

                setTimeout(function() {
                    document.getElementById(test).click();
                    difficulty = Timer.selectedDifficulty;
                    scoreAfter = Game.score;
                    console.log(
                        `Game reset. Score = ${scoreAfter}, difficulty: ${difficulty}\n` +
                        `${scoreBefore !== scoreAfter && difficulty === null ? 'Reset button test PASSED' : 'Reset button test FAILED'}`
                    );
                }, 3500);

            })(test);
        }, 1500);
    }, 2000);
}

if (window.location.href === 'https://anomalous-headset.000webhostapp.com/memory/tests/memory.test.html')
{
    document.body.style.background = "none";
    document.body.style.padding = "0";
    document.getElementsByClassName('wrapper')[0].style.display = "none";
}


export {randomNumber, shuffle, Game, Timer}