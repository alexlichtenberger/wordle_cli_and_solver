"use strict";
exports.__esModule = true;
var wordle_1 = require("./wordle");
var shared_1 = require("./shared");
var get_human_guess = function () {
    var prompt = require('prompt-sync')();
    var input = prompt("Enter your guess: ");
    while (!wordle_1.acceptable_words.includes(input)) {
        console.log("That's not an acceptable word.");
        input = prompt("Enter your guess:");
    }
    return input;
};
var game = (0, wordle_1.create_game)(get_human_guess, shared_1.draw_board_cli);
while (game.status === wordle_1.GAME_STATUS.IN_PROGRESS) {
    (0, wordle_1.play_round)(game);
}
if (game.status === wordle_1.GAME_STATUS.WON)
    console.log("You WON! The word was ".concat(game.ctx.target._word));
else if (game.status === wordle_1.GAME_STATUS.LOST) {
    console.log("You're out of guesses...\nThe word was ".concat(game.ctx.target._word, ".\nBetter luck next time!"));
}
