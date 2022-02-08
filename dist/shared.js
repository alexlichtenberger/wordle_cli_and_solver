"use strict";
exports.__esModule = true;
exports.draw_board_cli = void 0;
var wordle_1 = require("./wordle");
var draw_board_cli = function (ctx) {
    var guesses = ctx.guesses;
    console.log("\n+======WORDLE======+");
    console.log("|                  |");
    for (var i = 0; i < ctx.num_guesses; i++) {
        if (guesses[i]) {
            console.log("| " + guesses[i].grade.reduce(function (p, c) { return p + c; }) + " ".concat(guesses[i]._guess._word, " |"));
        }
        else {
            console.log("| " + wordle_1.TILE_STATES._E + wordle_1.TILE_STATES._E + wordle_1.TILE_STATES._E + wordle_1.TILE_STATES._E + wordle_1.TILE_STATES._E + "       |");
        }
    }
    console.log("|                  |");
    console.log("+==================+");
};
exports.draw_board_cli = draw_board_cli;
