'use strict';

require ('dotenv').config();

const axios = require('axios');

const express = require('express');
const router = express.Router();
const sanitizeString = require('../utils/sanitize-string');

const { Game, Platform, PlatformLogo } = require('../models');

const headers = {
    'Accept': process.env.HEADER_ACCEPT,
    'Client-ID': process.env.HEADER_CLIENT_ID,
    'Authorization': process.env.HEADER_AUTHORIZATION,
    'Content-Type': process.env.HEADER_CONTENT_TYPE,
};

async function fetchAndUpdateGames(offset) {
    try {
        let data = `fields *;limit 500; offset ${offset};sort id asc;`;
        console.log('Fetched ' + offset + ' games   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            data,
            {
                headers: headers,
            }
        );
        const gamesData = response.data;
        if (gamesData.length === 0) {
            console.log('No more games to fetch.');
            return;
        }
        const sanitizedGamesData = gamesData.map(game => ({
            ...game,
            name: sanitizeString(game.name),
            summary: sanitizeString(game.summary),
            slug: sanitizeString(game.slug),
            version_title: sanitizeString(game.version_title),
        }));
        await Game.bulkCreate(sanitizedGamesData);
        setTimeout(async () => {
            await fetchAndUpdateGames(offset + 500);
        }, 5000);
        } catch (error) {
        console.error('Error fetching and updating data:', error);
        } 
    }
    
async function fetchAndUpdatePlatformLogos(offset) {
    try {
        let data = `fields *;limit 500;offset ${offset};sort id asc;`;
        const response = await axios.post(
            'https://api.igdb.com/v4/platform_logos',
            data,
            {
                headers: headers,
            }
        );
        const platformLogosData = response.data;
        if (platformLogosData.length === 0) {
            console.log('No more platform logos to fetch.');
            return;
        }
        const sanitizedPlatformLogosData = platformLogosData.map(platformLogo => ({
            ...platformLogo,
            url: sanitizeString(platformLogo.url),
        }));
        await PlatformLogo.bulkCreate(sanitizedPlatformLogosData);
        setTimeout(async () => {
            await fetchAndUpdatePlatformLogos(offset + 500);
        }, 5000);
        } catch (error) {
        console.error('Error fetching and updating platform logos:', error);
        }
    }
    
async function fetchAndUpdatePlatforms(offset) {
    try {
    let data = `fields *;limit 500;offset ${offset};sort id asc;`;
    const response = await axios.post('https://api.igdb.com/v4/platforms', 
        data, 
        { 
            headers: headers 
        }
    );
    const platformsData = response.data;
    if (platformsData.length === 0) {
        console.log('No more platforms to fetch.');
        return;
    }
    const sanitizedPlatformsData = platformsData.map(platform => ({
        ...platform,
        summary: sanitizeString(platform.summary),
        platformLogo: platform.platform_logo,
    }));
    await Platform.bulkCreate(sanitizedPlatformsData);
    setTimeout(async () => {
        await fetchAndUpdatePlatforms(offset + 500);
    }, 5000);
    } catch (error) {
    console.error('Error fetching and updating platforms:', error);
    }
}

router.get('/games', async (req, res) => {
    try {
    await fetchAndUpdateGames(0);
    res.status(200).json({ message: 'Data update complete.' });
    } catch (error) {
    console.error('Error updating games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/platforms', async (req, res) => {
    try {
    await fetchAndUpdatePlatforms(0);
    res.status(200).json({ message: 'Platform update complete.' });
    } catch (error) {
    console.error('Error updating platforms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/logos', async (req, res) => {
    try {
    await fetchAndUpdatePlatformLogos(0);
    res.status(200).json({ message: 'Platform logo update complete.' });
    } catch (error) {
    console.error('Error updating platform logos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;