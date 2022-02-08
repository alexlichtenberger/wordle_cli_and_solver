import {play_round, Game_State, acceptable_words, GAME_STATUS, TILE_STATES, create_game} from './wordle'
import {draw_board_cli} from './shared'

const get_human_guess = (): string => {
    const prompt = require('prompt-sync')();

    let input = prompt("Enter your guess: ")

    while(!acceptable_words.includes(input)){
        console.log("That's not an acceptable word.")
        input = prompt("Enter your guess:")
    }

    return input
} 



let game = create_game(get_human_guess, draw_board_cli)


while(game.status === GAME_STATUS.IN_PROGRESS) {
    play_round(game)    
}

if (game.status === GAME_STATUS.WON)
    console.log(`You WON! The word was ${game.ctx.target._word}`)
else if (game.status === GAME_STATUS.LOST) {
    console.log(`You're out of guesses...\nThe word was ${game.ctx.target._word}.\nBetter luck next time!`)
}
