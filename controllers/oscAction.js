const osc = require("osc");

let udp;

try {

    udp = new osc.UDPPort({
        localAddress: "0.0.0.0",
        localPort: 9001,
        remoteAddress: "127.0.0.1",
        remotePort: 9000,
        metadata: true
    });

    udp.open();

    udp.on("ready", function () {
        console.log('\nVRChat connection opened.\n');
    });

} catch(err) {
    console.log('Couldn\'t open UDP connection on 127.0.0.1:9000');
    console.log(err);
}

let activeOsc = [];

exports.oscTrigger = async (action) => {

    console.log('OSC action found');

    /* Check if already active */
    let foundAction = activeOsc.find(el => el.redeemName == action.redeemName);
    /* Not found, add it the the array */
    if (!foundAction) {
        /* Init timer */
        let timedAction = { ...action };
        timedAction.timer = setTimeout(
            oscSend,
            timedAction.duration * 1000,
            timedAction.redeemName,
            timedAction.address,
            timedAction.callbackValue,
            true);
        activeOsc.push(timedAction);
        oscSend(timedAction.redeemName, timedAction.address, timedAction.value, false);

    } else {
        /* Update timer */
        let currActionIndex = activeOsc.findIndex(el => el.redeemName == action.redeemName);
        clearTimeout(activeOsc[currActionIndex].timer);
        let newTimer = activeOsc[currActionIndex].duration * 1000 + getTimeLeft(activeOsc[currActionIndex].timer);
        activeOsc[currActionIndex].timer = setTimeout(
            oscSend,
            newTimer,
            activeOsc[currActionIndex].redeemName,
            activeOsc[currActionIndex].address,
            activeOsc[currActionIndex].callbackValue,
            true);
    }

}

function getTimeLeft(timeout){
    return Math.ceil((timeout._idleStart + timeout._idleTimeout)/1000 - process.uptime());
}

function oscSend(redeemName, address, value, isCallback) {
    try {

        let arg;
        switch (typeof value) {
            case 'number':
                arg = {type: 'i', value: value}
                break;
            case 'boolean':
                arg = {type: value ? 'T' : 'F'}
                break;
            case 'string':
                arg = {type: 's', value: value}
                break;
        }

        udp.send({
            address: address,
            args: [arg]
        });

        console.log(`'${redeemName}': sending '${value}' to '${address}'`);
        if (isCallback) {
            // Remove action from array
            activeOsc.splice(activeOsc.findIndex(el => el.redeemName == redeemName), 1);
        }

    } catch(err) {
        console.log('OSC CPT - Couldn\'t send message to VRC');
        console.log(err);
    }
}