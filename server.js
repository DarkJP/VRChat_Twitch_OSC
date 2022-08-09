const checkFiles = require('./controllers/checkFiles.js');
try {
    checkFiles.check();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}

require('dotenv').config();
const { readFileSync } = require('fs');
const http = require('http');
const express = require('express');
const controller = require('./controllers/controller.js');

/* +----------------------------+ */
/* |         Web Server         | */
/* +----------------------------+ */
const dashboard = express();
const dashboardServer = http.createServer(dashboard);
const dashboardRoutes = require('./routes/dashboardRoutes');
dashboard.use('/', dashboardRoutes);
dashboard.use(express.static('publicDashboard'));

/* +----------------------------+ */
/* |      Twitch Connection     | */
/* +----------------------------+ */
const twitch = require('./controllers/twitchRedeems.js');

(async () => {
    try {
        const DASHBOARD_PORT = process.env.DASHBOARD_PORT ?? 621;
        dashboardServer.listen(DASHBOARD_PORT);

        console.log('+----------------------------------------------------------+\n'
                  + '|                         Welcome!                         |\n'
                  + '|   Dashboard can be accessed from: http://localhost:' + DASHBOARD_PORT + '   |\n'
                  + '+----------------------------------------------------------+');
        console.log('Press ctrl + C anytime to stop the server.\n'
                    + 'Start the server with \'node server.js\'');

        let rawSettings = readFileSync('./data/settings.json', 'utf8');
        let settings = JSON.parse(rawSettings);
        if (!settings.isAuth) {
            console.log(
                'Application not authorized yet.'
                + '\nHead over to the the dashboard.'
            );

        } else {
            twitch.startAuth();
        }

    } catch(err) {
        console.log('Oop! Could not start the server.');
        console.log(err);
    }
})();