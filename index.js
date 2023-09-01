const glob = require("glob")
const { default: SlippiGame } = require('@slippi/slippi-js')

const files = glob.sync("**/*.slp");
console.log("files", files)


const game = new SlippiGame(files[0])
        const settings = game.getSettings()
        const data = game.getMetadata()
        console.log("data", data, "settings", settings)

        //todo: write code that pulls the character name, color, and then rename our SLP file
        // try to push this to github
        // change the title to player name, if no name, character port and color for both characters. Put in a w/l