/*
Memory game


First Screen:
Game must contain pairs of cards, face down (10 pairs, 20 cards)
User can select two (and only two cards) so as to find all the pairs
When user selects a card, it shifts and reveals its face
If both cards are different, shift them face down again
If they are the same, a little animation plays to reward the user

User has a limited amount of time to play, based upon his difficulty setting choice
Easy: 5mins, Medium: 3mins, Hard: 2mins
Animations must be swift enough to account for the hardest setting (2mins)

Second Screen:
Display either when timer runs out or player wins
Show the score (maybe history?)
Replay button


Logic:
At the start of the game


 */


/*
Shuffles array it receives as a parameter into a new temporary array then returns it
 */
function shuffle(cards)
{
    let temp = [];

    for (let i = 0; i < cards.length; i++)
    {
        temp.push(cards[i]);
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


/*
Prepares the board for game start
 */
function prepareBoard(shuffled)
{
    for (let i = 0; i < shuffled.length; i++)
    {
        let img = document.createElement('img');
        img.src = `assets/${shuffled[i].path}`;
        img.style.display = "none";

        let container = document.createElement('div');
        container.id = shuffled[i].id;
        container.classList.add('card-container');

        container.appendChild(img);

        gameBoard.appendChild(container);
    }
}



/*
Add click event listener on all existing card container
 */
function createCardContainersListeners()
{
    for (let i = 0; i < cardContainers.length; i++)
    {
        cardContainers[i].addEventListener('click', function(e)
        {
            if (!handlingClickEvent)
            {

            }
            let el = e.target;

            userSelection.push(el);

            el.firstChild.style.display = "block";


            if (userSelection.length === 2)
            {
                let firstChoice = cards[userSelection[0].id],
                    secondChoice = cards[userSelection[1].id];


                if (firstChoice.path === secondChoice.path)
                {
                    score++;
                    userSelection = [];
                } else {
                    setTimeout(function(){
                        userSelection.forEach(function(item)
                        {
                            item.firstChild.style.display = "none";
                        });
                        userSelection = [];
                    }, 1000);
                }
            }

        })
    }
}



/*
Variables
 */
let gameBoard = document.getElementById('game'),
    userSelection = [],
    cards = [
    {
        id: 0,
        path: "armor.png",
    },
    {
        id: 1,
        path: "armor.png",
    },
    {
        id: 2,
        path: "axe.png",
    },
    {
        id: 3,
        path: "axe.png",
    },
    {
        id: 4,
        path: "dagger.png",
    },
    {
        id: 5,
        path: "dagger.png",
    },
    {
        id: 6,
        path: "shield.png",
    },
    {
        id: 7,
        path: "shield.png",
    },
    {
        id: 8,
        path: "tome.png",
    },
    {
        id: 9,
        path: "tome.png",
    },
    {
        id: 10,
        path: "map.png",
    },
    {
        id: 11,
        path: "map.png",
    }
    ],
    shuffled = shuffle(cards),
    score = 0,
    cardContainers = document.getElementsByClassName('card-container'),
    handlingClickEvent = false;




prepareBoard(shuffled);


createCardContainersListeners();

