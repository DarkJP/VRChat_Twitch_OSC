# VRChat\_Twitch_OSC

A simple Node.js server that allows you to send OSC messages to VRChat on Twitch channel points redeems.

# Why

This little tool was created specifically for a streamer that couldn't find/get anything else working, or requiring an over-complicated setup.

The goal is also to have a simple and lightweight tool that doesn't rely on any other online resources. Everything runs on your machine (or any machine within your local network), so you have full control over everything.

### Donate

This tool is completely free, though you can give me a little tip if you really want, thank you!

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat&logo=paypal)](https://www.paypal.com/paypalme/DarkJPFox)

# Prerequisites

Running this tool requires having <a href="https://nodejs.org/en/">Node.js</a> installed on the machine running the server.

You will need version <a href="https://nodejs.org/download/release/v16.14.2/">16.14.2</a> or above.

Tested on Windows 10 version 21H2 and VRChat 2022.2.2.

# Need help?

I created a dedicated Discord server. If you need help or got any problems, feel free to join it and I'll try my best to help you there.

[![Discord Server](https://img.shields.io/discord/1006502742107377704?color=blue&label=Discord&logo=Discord)](https://discord.gg/NaNdz8EAV6)

# How does it works?

Redeems and what they do are configured in the ``data/VRCoscConfig.json`` file. There is no GUI, maybe that will come in the future.

### The JSON file

This is a simple JSON file, with an array of actions. It comes with a sample action so you have an example. It looks like this:
```
[
    {
        "redeemName": "Sample Redeem",
        "address": "/test/one",
        "value": 1,
        "callbackValue": 0,
        "duration": 10
    }
]
```

### Attributes breakdown

- **redeemName**: The name of the Twitch Redeem that will trigger this action. Make sure the names are the same, they're also case senstitive.

- **address**: The VRChat address on which to send the data. See the note below about that.

- **value**: The value to send when the action is triggered. This can either be Strings, Booleans, and Numbers.

- **callbackValue**: The value to send when the action ends. Let's say you want to enable something, you'd set ``true`` in the ``value`` field to enable, and ``false`` in the ``callbackValue`` field to disable. This will depend on your avatar parameters.

- **duration**: How long is the action taking (in seconds).

Note: see the VRChat documentation about <a href="https://docs.vrchat.com/docs/osc-avatar-parameters">avatar parameters</a>.

### Add another action

Simply copy paste another object, and change the fields as you want. Don't forget to add a comma ``,`` after each object's curly bracket if you have multiple objects!

```
[
    {
        "redeemName": "Sample Redeem 1",
        "address": "/test/one",
        "value": 1,
        "callbackValue": 0,
        "duration": 10
    },
    {
        "redeemName": "Sample Redeem 2",
        "address": "/test/two",
        "value": "some text",
        "callbackValue": "some other text",
        "duration": 15
    },
    {
        "redeemName": "Sample Redeem 3",
        "address": "/test/three",
        "value": true,
        "callbackValue": false,
        "duration": 20
    }
]
```

# Installation

## Video tutorial
If you prefer a video format, here's a YouTube video on how to install and use this tool.
$Otherwise keep reading for the text version.

<a href="">video tutorial [coming soon]</a>

## Text
### 1- Install Node.js

Again you can get it <a href="https://nodejs.org/en/">here</a>.

You can make sure it's installed correctly by typing ``node -v`` in a command line (that will display the verison you installed).

### 2- Clone the repo

Either use git to clone the repository or download the .zip and extract it anywhere you want.

### 3- Open a command line in the folder

I'm usually using git bash, but the standard Windows command line should work just fine.

### 4- Run ``npm install``

This command will download all the required packages that the tool uses.

### 5- Create your Twitch application

Head on over to the <a href="https://dev.twitch.tv/console/apps">Twitch developper console</a> to register a new app.

- You can name it however you want.

- Set the redirect OAuth URL to ``http://localhost:621`` (or whatever port you want, more on that at step 7).

- Select the category (I used ``other``, I actually don't know if this has any impact whatsoever).

Once the application is created, create a new secret key and copy it (either in your clipboard, or anywhere so you don't lose it). Note: Keep it somwhere safe, **NEVER** expose your application secret key!

### 6- Run ``node server.js``

This will create all the required file for the next steps.

### 7- Fill in the ``.env`` file

Open the ``.env`` file that just got created at the root of the directory.

Fill it in with the required information:
- DASHBOARD_PORT: This is the port on which the server runs. You can put whatever you want, though make sure it is not used anywhere else. It also has to match the redirect OAuth URL from step 5.

- CHANNEL_ID: Your Twitch channel ID. You have multiple ways to find your channel ID, here are two simple tools (I'm not associated with those tools in any way).

<a href="https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon">https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon</a>

<a href="https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/">https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/</a>

- CLIENT_ID: The client ID of the Twitch application you just created.

- CLIENT_SECRET: The secret ID of the Twitch application you just created.

### 8- Authorize your Twitch application

Run ``node server.js`` to start the server again and head on over the dashboard on <a href="http://localhost:621/">http://localhost:621/</a> (Or again whatever port you chose at step 7).

Click the ``Authorize`` button. This will open Twitch in a new tab. Authorize your application, and you will automatically get back to the dashboard. You can close it, the server should have saved the login information.

If the server doesn't stop automatically (I'm having no problems with the git bash console, however the Windows one sometimes acts weird and doesn't shut the server), you can shut it by pressing ``ctrl + C``).

### 9- Fill in the ``data/VRCoscConfig.json`` file

Fill in the file with the data you want. This has been explained above in the ``How does it works?`` paragraph.

### 10- Almost there!

Run the server again with ``node server.js`` and everything you start correctly.

![VRChat_Twitch_OSC_Connected](https://cdn.discordapp.com/attachments/990297958782226562/1006486678795472906/Twitch_VRC_OSC_connected.png)

### 11- Make sure VRChat is recieving the messages

You can check that VRChat is recieving OSC message using the in-game debugging. See the <a href="https://docs.vrchat.com/docs/osc-debugging">documentation</a>

# Done!

Everything should be working now, and your Twitch viewers should be able to mess with your VRchat avatar using redeems!