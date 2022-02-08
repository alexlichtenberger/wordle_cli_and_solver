import {Game_State, TILE_STATES} from './wordle'

export const draw_board_cli = (ctx: Game_State) =>{
    let guesses = ctx.guesses
    console.log("\n+======WORDLE======+")
    console.log("|                  |")
    for(let i = 0; i < ctx.num_guesses; i++){
        if (guesses[i]) {
            console.log("| " + guesses[i].grade.reduce((p,c) => p+c) + ` ${guesses[i]._guess._word} |`)
        }
        else {
            console.log("| " + TILE_STATES._E + TILE_STATES._E + TILE_STATES._E + TILE_STATES._E + TILE_STATES._E + "       |")
        }
    }
    console.log("|                  |")
    console.log("+==================+")
}