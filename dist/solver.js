"use strict";
exports.__esModule = true;
var wordle_1 = require("./wordle");
var shared_1 = require("./shared");
var bot_1 = require("./bot");
//PLAY GAME -----------------------------------------------------
var bot = new bot_1.Bot({ is_solver: true });
var get_user_grade = function (ctx) {
    var prompt = require('prompt-sync')();
    console.log("Enter the suggested guess and input wordle's feedback");
    console.log("'w' for wrong, 'c' for correct, 'i' for incorrect");
    console.log("                          XXXXX");
    var str_input = prompt('What did wordle tell you: ');
    if (str_input.toLowerCase() === 'win' || str_input.toLowerCase() === 'won' || str_input.toLowerCase() === 'exit') {
        game.display(ctx);
        process.exit(0);
    }
    return str_input.split("").map(function (letter) {
        switch (letter) {
            case 'c': return wordle_1.TILE_STATES._C;
            case 'i': return wordle_1.TILE_STATES._I;
            case 'w': return wordle_1.TILE_STATES._W;
        }
    });
};
var game = (0, wordle_1.create_game)(bot.guess, shared_1.draw_board_cli, null, get_user_grade);
console.log(game.ctx.target._word);
while (game.status === wordle_1.GAME_STATUS.IN_PROGRESS) {
    (0, wordle_1.play_round)(game);
    if (game.status === wordle_1.GAME_STATUS.WON) {
        console.log("You WON! The word was ".concat(game.ctx.target._word));
    }
    else if (game.status === wordle_1.GAME_STATUS.LOST) {
        console.log("You're out of guesses...\nThe word was ".concat(game.ctx.target._word, ".\nBetter luck next time!"));
    }
}
