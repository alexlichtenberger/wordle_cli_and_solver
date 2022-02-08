//IMPORTS ------------------------------------------------------------------
import { randomInt } from "crypto";
const fs = require('fs');

//CONSTANTS
const words_json = JSON.parse(fs.readFileSync('words.json'));
export const words = words_json.words

const words_eng = words_json.words_eng
export const acceptable_words: string[] = words_eng.concat(words)

export const TILE_STATES = {
    _C: "🟩", //correct
    _I: "🟨", //included
    _W: "⬛", //wrong
    _E: "⬜", //empty   
}

export const GAME_STATUS = {
    IN_PROGRESS: 0,
    WON: 1,
    LOST: 2,
}

export const NUM_GUESSES = 6;

//GAME ---------------------------------------------------------------------
export const play_round = (game: Game) => {
    let guess = make_guess(game)
    game.ctx.guesses.push(guess)
    game.display(game.ctx)
    game.ctx.turn++

    if (guess._guess._word === game.ctx.target._word){
        game.status = GAME_STATUS.WON
    }
    else if (game.ctx.turn >= NUM_GUESSES){
        game.status = GAME_STATUS.LOST
    }
}

const make_guess = (game): Guess => {
    let input = game.input_fn(game.ctx).toLowerCase()
    
    let guess = str_to_word(input)
    let grade = game.grade_fn(game.ctx, guess)

    return {_guess: guess, grade}
}

//HELPERS --------------------------------------------------------------------
export const str_to_word = (word): Word => {
    return {_word: word, letters: word.split("")}
}

const default_grade_fn = (ctx: Game_State, guess: Word) => {
    let display = []
    guess.letters.forEach((ltr, index) => {
        if (ltr === ctx.target.letters[index]){
            display.push(TILE_STATES._C)
        }
        else if (ctx.target.letters.includes(ltr)){
            display.push(TILE_STATES._I)
        }
        else {
            display.push(TILE_STATES._W);
        }
    })
    return display;
}

export const create_game = (input_fn, display, target?, grade_fn?): Game => {
    return {
        status: GAME_STATUS.IN_PROGRESS,
        ctx: {
            guesses: [],
            target: str_to_word(target ?? words[randomInt(words.length - 1)]),
            num_guesses: NUM_GUESSES,
            turn: 0,
        },
        input_fn,
        display,
        grade_fn: grade_fn ?? default_grade_fn
    }
}

//TYPES ----------------------------------------------------------------------
export type Guess = {
    _guess: Word
    grade: string[]
}

export type Word = {
    _word: string
    letters: string[]
}

export type Game_State = {
    guesses: Guess[]
    target: Word
    num_guesses: number
    turn: number
}

export type Game = {
    status: number
    ctx: Game_State
    input_fn: (ctx: Game_State) => string
    display: (ctx: Game_State) => void
    grade_fn: (ctx: Game_State, guess: Word) => string[]
}