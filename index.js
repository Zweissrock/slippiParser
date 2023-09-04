const fs = require("fs");
const glob = require("glob");
const _ = require("lodash");
const readlineSync = require("readline-sync");
const sanitize = require("sanitize-filename");
const { default: SlippiGame } = require("@slippi/slippi-js");
const { formatISO } = require("date-fns");

// Characters ordered by ID
const CHARACTERS = [
  "Captain Falcon",
  "Donkey Kong",
  "Fox",
  "Mr. Game & Watch",
  "Kirby",
  "Bowser",
  "Link",
  "Luigi",
  "Mario",
  "Marth",
  "Mewtwo",
  "Ness",
  "Peach",
  "Pikachu",
  "Ice Climbers",
  "Jigglypuff",
  "Samus",
  "Yoshi",
  "Zelda",
  "Sheik",
  "Falco",
  "Young Link",
  "Dr. Mario",
  "Roy",
  "Pichu",
  "Ganondorf",
  "Master Hand",
  "Male Wireframe",
  "Female Wireframe",
  "Giga Bowser",
  "Crazy Hand",
  "Sandbag",
  "Popo",
  "Unknown",
];

const STAGES = [
  null,
  null,
  "Fountain of Dreams",
  "Pokémon Stadium",
  "Princess Peach's Castle",
  "Kongo Jungle",
  "Brinstar",
  "Corneria",
  "Yoshi's Story",
  "Onett",
  "Mute City",
  "Rainbow Cruise",
  "Jungle Japes",
  "Great Bay",
  "Hyrule Temple",
  "Brinstar Depths",
  "Yoshi's Island",
  "Green Greens",
  "Fourside",
  "Mushroom Kingdom I",
  "Mushroom Kingdom II",
  null,
  "Venom",
  "Poké Floats",
  "Big Blue",
  "Icicle Mountain",
  "Icetop",
  "Flat Zone",
  "Dream Land N64",
  "Yoshi's Island N64",
  "Kongo Jungle N64",
  "Battlefield",
  "Final Destination",
];

const inputDirectory =
  readlineSync.question("Enter the input directory (default: ./input): ") ||
  "./input";
if (!fs.existsSync(inputDirectory)) {
  console.error("Input directory does not exist");
  process.exit(1);
}

const outputDirectory =
  readlineSync.question("Enter the output directory (default: ./output): ") ||
  "./output";

const ignoreCharacterChanges = readlineSync.keyInYN(
  "Ignore character changes? (default: yes): "
);

const files = glob.sync("*.slp", { cwd: inputDirectory });
const groups = {};

let prevPlayers = null;

for (const file of files) {
  const game = new SlippiGame(`${inputDirectory}/${file}`);
  const settings = game.getSettings();
  const metadata = game.getMetadata();

  // TODO - implement teams
  if (settings.isTeams) {
    console.log("Teams are not supported yet. Skipping game.");
    continue;
  }

  const p1 = settings.players[0];
  const p2 = settings.players[1];

  const p1Metadata = metadata.players[p1.playerIndex];
  const p2Metadata = metadata.players[p2.playerIndex];

  const p1NetplayName = p1Metadata.names.netplay;
  const p2NetplayName = p2Metadata.names.netplay;

  const p1NetplayCode = p1Metadata.names.code;
  const p2NetplayCode = p2Metadata.names.code;

  const name1 = p1.nametag || p1NetplayName || p1NetplayCode || "Player 1";
  const name2 = p2.nametag || p2NetplayName || p2NetplayCode || "Player 2";

  const c1 = CHARACTERS[p1.characterId];
  const c2 = CHARACTERS[p2.characterId];

  const stage = STAGES[settings.stageId];

  const startAt = metadata.startAt;

  const players = metadata.players;

  const fileData = {
    file,
    c1,
    c2,
    name1,
    name2,
    stage,
    startAt: new Date(startAt),
  };

  let groupKey = `${name1}-${name2}`;
  if (!ignoreCharacterChanges) {
    groupKey = `${name1}-${name2}-${c1}-${c2}`;
  }

  if (groups[groupKey]) {
    groups[groupKey].push(fileData);
  } else {
    groups[groupKey] = [fileData];
  }

  prevPlayers = players;
}

for (const groupKey in groups) {
  const group = groups[groupKey];
  const [fileData] = group;
  const { c1, name1, c2, name2 } = fileData;
  const startAt = Math.min(...group.map((data) => data.startAt)); // Find the earliest startAt
  const folderName = `${
    formatISO(startAt, {
      format: "basic",
    }).split("-")[0]
  } - ${name1} (${c1}) vs. ${name2} (${c2})`; // Include the earliest startAt in the group name
  const groupDirectory = `${outputDirectory}/${sanitize(folderName)}`;
  if (!fs.existsSync(groupDirectory)) {
    fs.mkdirSync(groupDirectory);
  }
  for (const fileData of group) {
    const { file, c1, name1, c2, name2, startAt, stage } = fileData;
    const startAtISO = formatISO(startAt, { format: "basic" }).split("-")[0];
    const newFileName = `${startAtISO} - ${name1} (${c1}) vs. ${name2} (${c2}) - ${stage}.slp`;
    const sourcePath = `${inputDirectory}/${file}`;
    const destinationPath = `${groupDirectory}/${sanitize(newFileName)}`;
    fs.copyFileSync(sourcePath, destinationPath);
  }
}
