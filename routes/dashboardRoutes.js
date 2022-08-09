const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const { readFileSync, writeFileSync } = require('fs');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './../publicDashboard', 'index.html'));
});

router.get('/getclientid', express.json(), async (req, res) => {
    let clientId = process.env.CLIENT_ID ?? undefined;

    res.status(200).json({ clientId });
});

router.get('/getdashboardport', express.json(), async (req, res) => {
    let port = process.env.DASHBOARD_PORT ?? undefined;

    res.status(200).json({ port });
});

router.post('/creds', express.json(), async (req, res) => {

    let TokenReqStr =
        'https://id.twitch.tv/oauth2/token?client_id='
        + process.env.CLIENT_ID
        + '&client_secret='
        + process.env.CLIENT_SECRET
        + '&code='
        + req.body.code
        + '&grant_type=authorization_code&redirect_uri=http://localhost:' + (process.env.CLIENT_ID.DASHBOARD_PORT ?? 621)
    let tokenRes = await fetch(TokenReqStr, {method: 'POST'});
    let tokenAns = await tokenRes.json();

    writeFileSync('./data/refreshToken.txt', tokenAns.refresh_token);
    writeFileSync('./data/token.txt', tokenAns.access_token);

    setSetting('isAuth', true);

    res.status(200).json({ msg: 'App authorized successfuly.' });
    console.log('\nAuth info saved.\nYou can restart the server.');
    process.exit(0);
});

function setSetting(setting, val) {
    let rawSettings = readFileSync('./data/settings.json', {encoding: 'utf-8'});
    let settings = JSON.parse(rawSettings);
    settings[setting] = val;
    writeFileSync('./data/settings.json', JSON.stringify(settings), 'utf8');
}

module.exports = router;