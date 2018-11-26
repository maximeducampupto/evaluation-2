/* * * * * * * * * * *
 * Variables
 * * * * * * * * * * */
let gameBoard = document.getElementById('game'),
    userSelection = [],
    cards = [
        {
            id: 0,
            path: "armor",
        },
        {
            id: 1,
            path: "armor",
        },
        {
            id: 2,
            path: "axe",
        },
        {
            id: 3,
            path: "axe",
        },
        {
            id: 4,
            path: "dagger",
        },
        {
            id: 5,
            path: "dagger",
        },
        {
            id: 6,
            path: "upg_shield",
        },
        {
            id: 7,
            path: "upg_shield",
        },
        {
            id: 8,
            path: "tome",
        },
        {
            id: 9,
            path: "tome",
        },
        {
            id: 10,
            path: "map",
        },
        {
            id: 11,
            path: "map",
        },
        {
            id: 12,
            path: "axe2",
        },
        {
            id: 13,
            path: "axe2",
        },
        {
            id: 14,
            path: "axeDouble2",
        },
        {
            id: 15,
            path: "axeDouble2",
        },
        {
            id: 16,
            path: "backpack",
        },
        {
            id: 17,
            path: "backpack",
        },
        {
            id: 18,
            path: "sword",
        },
        {
            id: 19,
            path: "sword",
        },
        {
            id: 20,
            path: "envelope",
        },
        {
            id: 21,
            path: "envelope",
        },
        {
            id: 22,
            path: "scroll",
        },
        {
            id: 23,
            path: "scroll",
        },
    ],
    shuffled = shuffle(cards),
    score = 0,
    cardsDiv = document.getElementsByClassName('card');

/* * * * * * * * * * *
 * Creates html elements from randomized array of objects
 * * * * * * * * * * */
function prepareBoard(arrayObj)
{
    for (let i = 0; i < arrayObj.length; i++)
    {
        let card = document.createElement('div');

        card.classList.add('card');
        card.id = arrayObj[i].id;
        card.setAttribute('data-path', arrayObj[i].path);

        gameBoard.appendChild(card);
    }
}


/* * * * * * * * * * *
* Shuffles array it receives as a parameter into a new temporary array then returns it
* * * * * * * * * * */
function shuffle(array)
{
    let temp = [];

    for (let i = 0; i < array.length; i++)
    {
        temp.push(array[i]);
    }

    let currentIndex = temp.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = temp[currentIndex];
        temp[currentIndex] = temp[randomIndex];
        temp[randomIndex] = temporaryValue;
    }

    return temp;
}

/* * * * * * * * * * *
* // TODO
* * * * * * * * * * */
function createListeners()
{
    for (let i = 0; i < cardsDiv.length; i++)
    {
        cardsDiv[i].addEventListener('click', function(e)
        {
           let target = e.target;

           if (userSelection.length < 2)
           {
               Animator.flip(target);
               userSelection.push(target);
           }

           if (userSelection.length === 2)
           {
               let firstChoice = userSelection[0],
                   secondChoice = userSelection[1];

               if (firstChoice.getAttribute('data-path') === secondChoice.getAttribute('data-path'))
               {
                   score++;
                   userSelection = [];
               } else {
                   Animator.flipBack(firstChoice, target);
               }
           }
        });
    }
}

/* * * * * * * * * * *
* // TODO
* * * * * * * * * * */
let Animator = {
    removeCLasses: function(card)
    {
        card.className = "card";
    },

    flip: function(card)
    {
        card.classList.add('flipped');
        setTimeout(function()
        {
            card.classList.add(card.getAttribute('data-path'));
        }, 100);
    },

    flipBack: function(firstChoice, target)
    {
        setTimeout(function() {
            firstChoice.className = "card";
            target.className = "card";
            userSelection = [];
        }, 500);
    }


};




prepareBoard(shuffled);
createListeners();