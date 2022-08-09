const fetch = require('node-fetch');
const wsClient = require('ws');
const { readFileSync, writeFileSync } = require('fs');
const { vrcOscActions } = require('./controller.js');
const { oscTrigger } = require('./oscAction.js');
let ws; // Websocket connection to the Twitch Pub/Sub

let pingInterval;
let maxConnectionAtempts = 0;
let hasSubscribed = false;

/* Open the Twitch Pub/Sub connection */
async function openWS() {

    if (process.env.REFRESH_TOKEN == ''
        || process.env.CLIENT_ID == ''
        || process.env.CLIENT_SECRET == ''
        ) {
        console.log('Twitch credentials not set up. Check the ./data/.env config file.');
        process.exit(1);
    }

    ws = new wsClient('wss://pubsub-edge.twitch.tv');

    ws.onopen = function(event) {
        console.log('INFO: Socket Opened');
        sendPing();
        pingInterval = setInterval(sendPing, 60 * 1000);
    };

    ws.onerror = function(error) {
        console.log('ERR:  ' + JSON.stringify(error) + '');
    };

    ws.onmessage = async function(event) {
        let message = JSON.parse(event.data);

        if (message.type == 'RECONNECT') {
            console.log('RECV: RECONNECT');
            console.log('INFO: Atempting to reconnect in 3s...');
            setTimeout(openWS, 3000);
        }

        if (message.type == 'PONG') {
            console.log('RECV: PONG');
            if (!hasSubscribed) {
                hasSubscribed = true;
                subscribe();
            }
        }

        if (message.error == 'ERR_BADAUTH') {
            console.log('ERR: Invalid Oauth Token');
            if (maxConnectionAtempts <= 3) {
                await refreshToken();
                maxConnectionAtempts++;
                subscribe();
            } else {
                console.log('Multiple Twitch connections failed.'
                    + 'Make sure that you have authorized the app in the dashboard'
                    + ' and that the credentials are correct.');
                process.exit(1);
            }
        }

        if (message.type == 'RESPONSE' && message.error == '') {
            console.log('Successfully connected to Twitch!\nListening to redeems...');
        }

        if (message.type == 'MESSAGE') {
            let redemption = JSON.parse(message.data.message).data.redemption;
            let username = redemption.user.login;
            let redeemTitle = redemption.reward.title;

            console.log(`User '${username}' redeemed '${redeemTitle}'`);
            await redeemNameToTrigger(redeemTitle);
        }
    };

    ws.onclose = function() {
        console.log('INFO: Socket Closed');
        clearInterval(pingInterval);
        console.log('INFO: Atempting to reconnect in 3s...');
        setTimeout(openWS, 3000);
    };
}

/* Send a request to listen to a specific subject */
function subscribe() {
    ws.send(
        JSON.stringify(
            {"type": "LISTEN",
             "data": {
                 "topics": ["channel-points-channel-v1." + process.env.CHANNEL_ID],
                 "auth_token": getToken()}
            }
        )
    );
}

function sendPing() {
    ws.send(JSON.stringify({'type': 'PING'}));
    console.log('SENT: PING');
}

/* Request a new Oauth token (~4 hours lifespan) */
async function refreshToken() {
    let refTok = getRefToken();
    let fetchUrl = 'https://id.twitch.tv/oauth2/token'
                   + '?grant_type=refresh_token'
                   + '&refresh_token=' + refTok
                   + '&client_id=' + process.env.CLIENT_ID
                   + '&client_secret=' + process.env.CLIENT_SECRET;
    let res = await fetch(fetchUrl, {method: 'POST'});
    res = await res.json();
    saveToken(res.access_token);
    saveRefToken(res.refresh_token);
    console.log('Got new token');
}

/* Gets token from file data/token.txt */
function getToken() {
    return readFileSync('data/token.txt', {encoding: 'utf-8'});
}

/* Gets token from file data/refreshToken.txt */
function getRefToken() {
    return readFileSync('data/refreshToken.txt', {encoding: 'utf-8'});
}

/* Save access token in data/token.txt file */
function saveToken(token) {
    try {
        writeFileSync('data/token.txt', token);
    } catch (err) {
        console.error(err)
    }
}

/* Save refresh token in data/refreshToken.txt file */
function saveRefToken(token) {
    try {
        writeFileSync('./data/refreshToken.txt', token);
    } catch (err) {
        console.error(err)
    }
}

/* Triggers the OBS actions corresponding to the Twitch redeem */
async function redeemNameToTrigger(redeemTitle) {
    /* Check for osc action */
    let oscAction = vrcOscActions.find(el => el.redeemName == redeemTitle);
    if (oscAction) await oscTrigger(oscAction);
}

exports.startAuth = async () => {
    console.log('Connecting to Twitch...');
    await openWS();
}