"use strict";
exports.__esModule = true;
exports.create_game = exports.str_to_word = exports.play_round = exports.NUM_GUESSES = exports.GAME_STATUS = exports.TILE_STATES = exports.acceptable_words = exports.words = void 0;
//IMPORTS ------------------------------------------------------------------
var crypto_1 = require("crypto");
var fs = require('fs');
//CONSTANTS
var words_json = JSON.parse(fs.readFileSync('words.json'));
exports.words = words_json.words;
var words_eng = words_json.words_eng;
exports.acceptable_words = words_eng.concat(exports.words);
exports.TILE_STATES = {
    _C: "🟩",
    _I: "🟨",
    _W: "⬛",
    _E: "⬜"
};
exports.GAME_STATUS = {
    IN_PROGRESS: 0,
    WON: 1,
    LOST: 2
};
exports.NUM_GUESSES = 6;
//GAME ---------------------------------------------------------------------
var play_round = function (game) {
    var guess = make_guess(game);
    game.ctx.guesses.push(guess);
    game.display(game.ctx);
    game.ctx.turn++;
    if (guess._guess._word === game.ctx.target._word) {
        game.status = exports.GAME_STATUS.WON;
    }
    else if (game.ctx.turn >= exports.NUM_GUESSES) {
        game.status = exports.GAME_STATUS.LOST;
    }
};
exports.play_round = play_round;
var make_guess = function (game) {
    var input = game.input_fn(game.ctx).toLowerCase();
    var guess = (0, exports.str_to_word)(input);
    var grade = game.grade_fn(game.ctx, guess);
    return { _guess: guess, grade: grade };
};
//HELPERS --------------------------------------------------------------------
var str_to_word = function (word) {
    return { _word: word, letters: word.split("") };
};
exports.str_to_word = str_to_word;
var default_grade_fn = function (ctx, guess) {
    var display = [];
    guess.letters.forEach(function (ltr, index) {
        if (ltr === ctx.target.letters[index]) {
            display.push(exports.TILE_STATES._C);
        }
        else if (ctx.target.letters.includes(ltr)) {
            display.push(exports.TILE_STATES._I);
        }
        else {
            display.push(exports.TILE_STATES._W);
        }
    });
    return display;
};
var create_game = function (input_fn, display, target, grade_fn) {
    return {
        status: exports.GAME_STATUS.IN_PROGRESS,
        ctx: {
            guesses: [],
            target: (0, exports.str_to_word)(target !== null && target !== void 0 ? target : exports.words[(0, crypto_1.randomInt)(exports.words.length - 1)]),
            num_guesses: exports.NUM_GUESSES,
            turn: 0
        },
        input_fn: input_fn,
        display: display,
        grade_fn: grade_fn !== null && grade_fn !== void 0 ? grade_fn : default_grade_fn
    };
};
exports.create_game = create_game;
