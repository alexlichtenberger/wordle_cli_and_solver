import { randomInt } from 'crypto'
import {play_round, Word, Game_State, words, str_to_word, GAME_STATUS, TILE_STATES, create_game} from './wordle'
import {draw_board_cli} from './shared'

export class Bot {
    is_solver: boolean
    possible_words: Word[]
    parameters: {
        included: string[]
        correct: string[]
        inc_at_idx: pair[]
        wrong: string[]
    }

    constructor(config?) {
        if (config?.is_solver){
            this.is_solver = config.is_solver
        }
        this.parameters = {
            included: [],
            correct: [],
            inc_at_idx: [],
            wrong: [],
        }
        this.possible_words = words.slice().map((word) => {return str_to_word(word)})
    }

    guess = (ctx: Game_State): string => {
        // if (ctx.turn === 0) return 'crane'
        if (ctx.guesses[0]) {
            this.update_parameters(ctx)
            this.filter_possibilities(ctx)
            
        }
        let guess = this.find_guess(ctx)
        if (this.is_solver) { 
           console.log('\n+-Suggested guess:-------+')
            console.log('|                        |')
            console.log(`|          ${guess._word}         |`)
            console.log('|                        |')
            console.log('+------------------------+\n')
        }
        return guess._word
        // return this.possible_words[randomInt(this.possible_words.length)]._word
    }

    update_parameters = (ctx: Game_State) => {
        ctx.guesses.forEach((guess) => {
            guess.grade.forEach((value, index) => {
                let letter = guess._guess.letters[index]
                if (value === TILE_STATES._C) {
                    this.parameters.correct[index] = letter
                }
                if (value === TILE_STATES._I) {
                    this.parameters.included.push(letter)
                    this.parameters.inc_at_idx.push({idx:index, ltr:letter})
                }
                if (value === TILE_STATES._W) {
                    this.parameters.wrong.push(letter)
                }
            })
        })
    }
    
    filter_possibilities = (ctx:Game_State) => {
        // console.log(this.parameters)
        let new_possibilities = words.slice().map((word) => str_to_word(word)).filter((word: Word) => {
            // IF RIGHT AT RIGHT INDEX
            for(let i = 0; i < this.parameters.correct.length; i++) {
                if (this.parameters.correct[i] && word.letters[i] !== this.parameters.correct[i]) {
                    return false
                }
            }
            // IF LETTER IS INCLUDED
            for (let i = 0; i < this.parameters.included.length; i++){
                if (!word.letters.includes(this.parameters.included[i])){
                    return false
                }
            }
            //ELIMIANTE IF WORD CONTAINS WRONG LETTERS
            for (let i=0; i < this.parameters.wrong.length; i++) {
                if (word.letters.includes(this.parameters.wrong[i])){
                    return false
                }
            }
            //ELIMINATE IF WORD CONATINS INCLUDED LETTER AT ALREADY GUESSED IDX
            for (let i=0; i< this.parameters.inc_at_idx.length; i++) {
                let {idx, ltr} = this.parameters.inc_at_idx[i]
                if (word.letters[idx] === ltr){
                    return false
                }
            }
            //ELIMINATE IF WORD HAS BEEN GUESSED
            for (let i = 0; i < ctx.guesses.length; i++) {
                if (ctx.guesses[i] && word._word === ctx.guesses[i]._guess._word)
                return false
            }
            return true
        })
        // console.log(this.possible_words.length)
        // console.log(new_possibilities)
        this.possible_words = new_possibilities
    }

    find_guess = (ctx: Game_State): Word => {
        let letter_pos_freq = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
        this.possible_words.forEach((word) => {
            word.letters.forEach((letter, index) => {
                letter_pos_freq[index][ltr_to_idx(letter)] ++
            })
        })
        // console.log(letter_pos_freq)

        let optimal_word = [[],[],[],[],[]]
        letter_pos_freq.forEach((position, index) => {
            optimal_word[index] = argMaxIsh(position).map(idx_to_ltr)
        })
        // console.log(optimal_word)

        let word_scores = [];
        this.possible_words.forEach((word) => {
            let score = 0;
            word.letters.forEach((letter, index) => {
                if (optimal_word[index].includes(letter)) {
                    score ++;
                }
            })
            if (!word_scores[score])
                word_scores[score] = []
            word_scores[score].push(word)
            
        })
        if (this.is_solver) { 
            // console.log(word_scores)
            console.log("SUGGESTED WORDS: --------------------------------")
            console.log(word_scores[word_scores.length-1])
            console.log("END SUGGESTED WORDS: ----------------------------")
        }

        let top_words = word_scores[word_scores.length-1]
        return top_words[randomInt(top_words.length)]
    }
}

//HELPERS -------------------------------------------------------
const ltr_to_idx = (ltr: string) => {
    return ltr.charCodeAt(0) - 97
}

const idx_to_ltr = (idx: number) => {
    return String.fromCharCode(idx + 97)
}

function argMaxIsh(array: number[]) {
    let ltrs = []
    let max = array.reduce((acc, cur) => acc > cur ? acc : cur);
    array.forEach((value, index) => {
        if (value === max) ltrs.push(index)
    })
    return ltrs
  }

//PLAY GAME -----------------------------------------------------
let bot = new Bot()
let game = create_game(bot.guess, draw_board_cli)

console.log(game.ctx.target._word)

while(game.status === GAME_STATUS.IN_PROGRESS) {
    play_round(game)
    if (game.status === GAME_STATUS.WON) {
        console.log(`You WON! The word was ${game.ctx.target._word}`)
    }
    else if (game.status === GAME_STATUS.LOST) {
        console.log(`You're out of guesses...\nThe word was ${game.ctx.target._word}.\nBetter luck next time!`)
    }
}

//TYPES -------------------------------------------------------
type pair = {
    idx: number
    ltr: string
}