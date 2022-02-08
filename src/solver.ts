import {play_round, Game_State, GAME_STATUS, TILE_STATES, create_game} from './wordle'
import {draw_board_cli} from './shared'
import { Bot } from './bot'

//PLAY GAME -----------------------------------------------------
let bot = new Bot({is_solver: true})

const get_user_grade = (ctx: Game_State) => {
    const prompt = require('prompt-sync')();
    console.log("Enter the suggested guess and input wordle's feedback")
    console.log("'w' for wrong, 'c' for correct, 'i' for incorrect")
    console.log("                          XXXXX")
    let str_input: string = prompt('What did wordle tell you: ')
    if (str_input.toLowerCase() === 'win' || str_input.toLowerCase() === 'won' || str_input.toLowerCase() === 'exit') {
        game.display(ctx)
        process.exit(0)
    }
    return str_input.split("").map((letter) => {
        switch (letter) {
            case 'c': return TILE_STATES._C;
            case 'i': return TILE_STATES._I;
            case 'w': return TILE_STATES._W;
        }
    })
} 

let game = create_game(bot.guess, draw_board_cli, null, get_user_grade)

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