"use strict";
exports.__esModule = true;
exports.Bot = void 0;
var crypto_1 = require("crypto");
var wordle_1 = require("./wordle");
var shared_1 = require("./shared");
var Bot = /** @class */ (function () {
    function Bot(config) {
        var _this = this;
        this.guess = function (ctx) {
            // if (ctx.turn === 0) return 'crane'
            if (ctx.guesses[0]) {
                _this.update_parameters(ctx);
                _this.filter_possibilities(ctx);
            }
            var guess = _this.find_guess(ctx);
            if (_this.is_solver) {
                console.log('\n+-Suggested guess:-------+');
                console.log('|                        |');
                console.log("|          ".concat(guess._word, "         |"));
                console.log('|                        |');
                console.log('+------------------------+\n');
            }
            return guess._word;
            // return this.possible_words[randomInt(this.possible_words.length)]._word
        };
        this.update_parameters = function (ctx) {
            ctx.guesses.forEach(function (guess) {
                guess.grade.forEach(function (value, index) {
                    var letter = guess._guess.letters[index];
                    if (value === wordle_1.TILE_STATES._C) {
                        _this.parameters.correct[index] = letter;
                    }
                    if (value === wordle_1.TILE_STATES._I) {
                        _this.parameters.included.push(letter);
                        _this.parameters.inc_at_idx.push({ idx: index, ltr: letter });
                    }
                    if (value === wordle_1.TILE_STATES._W) {
                        _this.parameters.wrong.push(letter);
                    }
                });
            });
        };
        this.filter_possibilities = function (ctx) {
            // console.log(this.parameters)
            var new_possibilities = wordle_1.words.slice().map(function (word) { return (0, wordle_1.str_to_word)(word); }).filter(function (word) {
                // IF RIGHT AT RIGHT INDEX
                for (var i = 0; i < _this.parameters.correct.length; i++) {
                    if (_this.parameters.correct[i] && word.letters[i] !== _this.parameters.correct[i]) {
                        return false;
                    }
                }
                // IF LETTER IS INCLUDED
                for (var i = 0; i < _this.parameters.included.length; i++) {
                    if (!word.letters.includes(_this.parameters.included[i])) {
                        return false;
                    }
                }
                //ELIMIANTE IF WORD CONTAINS WRONG LETTERS
                for (var i = 0; i < _this.parameters.wrong.length; i++) {
                    if (word.letters.includes(_this.parameters.wrong[i])) {
                        return false;
                    }
                }
                //ELIMINATE IF WORD CONATINS INCLUDED LETTER AT ALREADY GUESSED IDX
                for (var i = 0; i < _this.parameters.inc_at_idx.length; i++) {
                    var _a = _this.parameters.inc_at_idx[i], idx = _a.idx, ltr = _a.ltr;
                    if (word.letters[idx] === ltr) {
                        return false;
                    }
                }
                //ELIMINATE IF WORD HAS BEEN GUESSED
                for (var i = 0; i < ctx.guesses.length; i++) {
                    if (ctx.guesses[i] && word._word === ctx.guesses[i]._guess._word)
                        return false;
                }
                return true;
            });
            // console.log(this.possible_words.length)
            // console.log(new_possibilities)
            _this.possible_words = new_possibilities;
        };
        this.find_guess = function (ctx) {
            var letter_pos_freq = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            _this.possible_words.forEach(function (word) {
                word.letters.forEach(function (letter, index) {
                    letter_pos_freq[index][ltr_to_idx(letter)]++;
                });
            });
            // console.log(letter_pos_freq)
            var optimal_word = [[], [], [], [], []];
            letter_pos_freq.forEach(function (position, index) {
                optimal_word[index] = argMaxIsh(position).map(idx_to_ltr);
            });
            // console.log(optimal_word)
            var word_scores = [];
            _this.possible_words.forEach(function (word) {
                var score = 0;
                word.letters.forEach(function (letter, index) {
                    if (optimal_word[index].includes(letter)) {
                        score++;
                    }
                });
                if (!word_scores[score])
                    word_scores[score] = [];
                word_scores[score].push(word);
            });
            if (_this.is_solver) {
                // console.log(word_scores)
                console.log("SUGGESTED WORDS: --------------------------------");
                console.log(word_scores[word_scores.length - 1]);
                console.log("END SUGGESTED WORDS: ----------------------------");
            }
            var top_words = word_scores[word_scores.length - 1];
            return top_words[(0, crypto_1.randomInt)(top_words.length)];
        };
        if (config === null || config === void 0 ? void 0 : config.is_solver) {
            this.is_solver = config.is_solver;
        }
        this.parameters = {
            included: [],
            correct: [],
            inc_at_idx: [],
            wrong: []
        };
        this.possible_words = wordle_1.words.slice().map(function (word) { return (0, wordle_1.str_to_word)(word); });
    }
    return Bot;
}());
exports.Bot = Bot;
//HELPERS -------------------------------------------------------
var ltr_to_idx = function (ltr) {
    return ltr.charCodeAt(0) - 97;
};
var idx_to_ltr = function (idx) {
    return String.fromCharCode(idx + 97);
};
function argMaxIsh(array) {
    var ltrs = [];
    var max = array.reduce(function (acc, cur) { return acc > cur ? acc : cur; });
    array.forEach(function (value, index) {
        if (value === max)
            ltrs.push(index);
    });
    return ltrs;
}
//PLAY GAME -----------------------------------------------------
var bot = new Bot();
var game = (0, wordle_1.create_game)(bot.guess, shared_1.draw_board_cli);
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
