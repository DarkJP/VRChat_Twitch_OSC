const { existsSync, writeFileSync, mkdirSync } = require('fs');

let restartFlag = false;

exports.check = () => {
    if (!existsSync('./data/')) {
        mkdirSync('./data');
    }

    if (!existsSync('./data/settings.json')) {
        writeFileSync('./data/settings.json', JSON.stringify({"isAuth":false}));
    }

    if (!existsSync('./.env')) {
        let data =
            '# Port on which the web server runs\n'
            + 'DASHBOARD_PORT="621"\n\n'
            + '# Your Twitch channel ID\n'
            + 'CHANNEL_ID=""\n\n'
            + '# Application client & secret ID\n'
            + '# DO NOT SHOW THESE TO ANYONE!\n'
            + 'CLIENT_ID=""\n'
            + 'CLIENT_SECRET=""';

        writeFileSync('./.env', data);
        restartFlag = true;
    }

    if (!existsSync('./data/token.txt')) {
        writeFileSync('./data/token.txt', '');
    }

    if (!existsSync('./data/refreshToken.txt')) {
        writeFileSync('./data/refreshToken.txt', '');
    }

    if (!existsSync('./data/VRCoscConfig.json')) {
        let sampleActions = [
            {
                "redeemName": "Sample Redeem",
                "address": "/test/one",
                "value": 1,
                "callbackValue": 0,
                "duration": 10
            }
        ]
        writeFileSync('./data/VRCoscConfig.json', JSON.stringify(sampleActions));
    }

    if (restartFlag) {
        throw new Error('.env configuration file has just been created.\n'
        + 'Please fill it in with your info and restart the server.');
    }
}