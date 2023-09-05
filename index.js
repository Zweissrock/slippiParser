
const glob = require("glob")
const { default: SlippiGame } = require('@slippi/slippi-js')

const files = glob.sync("**/*.slp");
console.log("files", files)

// Characters ordered by ID
const characters = ['Captain Falcon', 'Donkey Kong', 'Fox', 'Mr. Game & Watch', 'Kirby', 'Bowser',
            'Link', 'Luigi', 'Mario', 'Marth', 'Mewtwo', 'Ness', 'Peach', 'Pikachu',
            'Ice Climbers', 'Jigglypuff', 'Samus', 'Yoshi', 'Zelda', 'Sheik', 'Falco',
            'Young Link', 'Dr. Mario', 'Roy', 'Pichu', 'Ganondorf', 'Master Hand', 'Male Wireframe',
            'Female Wireframe', 'Giga Bowser', 'Crazy Hand', 'Sandbag', 'Popo', 'Unknown']

const characters_lowercase = ['captain falcon', 'donkey kong', 'fox', 'mr. game & watch', 'kirby', 'bowser',
            'link', 'luigi', 'mario', 'marth', 'mewtwo', 'ness', 'peach', 'pikachu',
            'ice climbers', 'jigglypuff', 'samus', 'yoshi', 'zelda', 'sheik', 'falco',
            'young link', 'dr. mario', 'roy', 'pichu', 'ganondorf', 'master hand', 'male wireframe',
            'female wireframe', 'giga bowser', 'crazy hand', 'sandbag', 'popo', 'Unknown']            

// Stages ordered by ID
const stages = [null, null, 'Fountain of Dreams', 'Pokémon Stadium', "Princess Peach's Castle", 'Kongo Jungle',
                'Brinstar', 'Corneria', "Yoshi's Story", 'Onett', 'Mute City', 'Rainbow Cruise', 'Jungle Japes',
                'Great Bay', 'Hyrule Temple', 'Brinstar Depths', "Yoshi's Island", 'Green Greens', 'Fourside', 
                'Mushroom Kingdom I', 'Mushroom Kingdom II', null, 'Venom', 'Poké Floats', 'Big Blue', 'Icicle Mountain',
                'Icetop', 'Flat Zone', 'Dream Land N64', "Yoshi's Island N64", 'Kongo Jungle N64', 'Battlefield', 'Final Destination']


const game = new SlippiGame(files[0])
const settings = game.getSettings()
const data = game.getMetadata()
function getIndex(stageId){
        return stages.findIndex(stage => stage === stageId);
}
        stage_num = settings.stageId
        stageIndex = getIndex(stage_num);
        console.log(stages[stageIndex])        

        //todo: write code that pulls the character name, color, and then rename our SLP file
        // try to push this to github -- done
        // change the title to player name, if no name, character port and color for both characters. Put in a w/l