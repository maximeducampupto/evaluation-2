import { randomNumber, shuffle, Game, Timer } from './memory.js';

describe('randomNumber', function() {

    it('should return a integer between 0 and the number provided as parameter', function() {
        let result = randomNumber(5);

       expect(result).toBeLessThanOrEqual(5);
       expect(result).toBeGreaterThanOrEqual(0);
    });

});

describe('shuffle', function() {

    it('should shuffle and return the array given as parameter', function() {

        let array = [1, 2, 3, 4, 5, 6],
            shuffled = shuffle(array);

        expect(shuffled).not.toEqual(array);
    });
});

describe('difficultyButtonsTest', function() {

    it('should start the game on the selected difficulty', function() {

        Timer.timeLeft = 1;
        document.getElementById('hard').click();

        expect(Game.isRunning).toBe(true);
        expect(Timer.selectedDifficulty).toBe('hard');
    });
});

describe('victoryConditionTest', function() {

    it('should increment the score when the player finds a pair', (done) => {
        Timer.timeLeft = 4;
        let scoreBefore = Game.score, scoreAfter, pair;

        document.getElementById('hard').click();
        pair = [document.getElementById('1'), document.getElementById('2')];
        pair[0].click();

        setTimeout(function() {
            pair[1].click();
            expect(Game.score).toBe(1);
        }, 500);

         done();

        expect(scoreBefore).toBe(0);
    });
    Game.restart();
});

describe('resetButtonTest', function() {

    it('should restart the game', function() {
       Game.start();
       Game.restart();

       expect(Game.isRunning).toBe(false);
       expect(Timer.timeLeft).toBe(0);
    });
});