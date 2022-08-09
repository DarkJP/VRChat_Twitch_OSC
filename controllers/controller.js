const { readFileSync } = require('fs');

try {
    let rawOscActions = readFileSync('./data/VRCoscConfig.json', 'utf8');
    let oscActions = JSON.parse(rawOscActions);
    exports.vrcOscActions = oscActions;

} catch(err) {
    console.log('Couldn\'t load VRCoscConfig.json');
    console.error(err);
    process.exit(1);
}