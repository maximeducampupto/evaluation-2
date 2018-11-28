function l(what)
{
    console.log(what);
}

function a(what)
{
    alert(what);
}

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

        img.src = `assets/${arrayObj[i].path}.png`;
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
           if (Game.isRunning)
           {
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
        });
    }
}


/* * * * * * * * * * *
*  Creation of listeners attached to the difficulty buttons and calls for gameStart()
* * * * * * * * * * */
function createDifficultyButtonsListeners()
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


            // TODO add class to fade out
            firstChoice.firstChild.style.display = "none";
            target.firstChild.style.display = "none";


            userSelection = [];
        }, 500);
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
        Game.isRunning = true;
        prepareBoard(shuffled);
        createCardListeners();
        Animator.displayBoard();
        Timer.start();
    }
};


createDifficultyButtonsListeners();

// TODO BUGS
// TODO Verif que le timer s'arrête correctement (ça a l'air d'être bon)