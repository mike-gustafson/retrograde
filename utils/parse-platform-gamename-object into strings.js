const { Platform, Game } = require('../models');

async function parsePlatformGamenameObjectIntoStrings(data) {
    const names = [];
    if (!data) return names;
    const ids = Object.entries(data);
    for (let i = 0; i < ids.length; i++) {
        const platformId = ids[i][0];
        const gameIds = ids[i][1];
        const platform = await Platform.findByPk(platformId);
        for (let j = 0; j < gameIds.length; j++) {
            const gameId = gameIds[j];
            const game = await Game.findByPk(gameId);
            names.push([platform.name, game.name]);
        }
    }
    return names;
}

module.exports = parsePlatformGamenameObjectIntoStrings;