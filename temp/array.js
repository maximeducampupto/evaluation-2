let array = [
        {
            param1: "test1",
            param2: "test1",
        },
        {
            param1: "test2",
            param2: "test2",
        },
        {
            param1: "test3",
            param2: "test3",
        },
        {
            param1: "test4",
            param2: "test4"
        }
    ],
    rand = randomNumber(array.length),
    shuffled = [];

function randomNumber(maxLength)
{
    return Math.floor(Math.random() * maxLength);
}

function shuffle(param)
{
    for (let i = 0; i < param.length; i++)
    {
        rand = randomNumber(param.length);
        if (shuffled.indexOf(param[rand]) === -1)
        {
            shuffled.push(param[rand]);
        } else {
            shuffled.push("");
            shuffled.pop();
            i--;
        }
    }

    return shuffled;
}

shuffle(array);


console.log(shuffled);