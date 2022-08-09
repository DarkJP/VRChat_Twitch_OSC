const btn_auth = document.getElementById('btn_auth');


document.addEventListener("DOMContentLoaded", pageLoaded);

async function pageLoaded() {

    let authCode = document.location.search.substring(6, document.location.search.indexOf('&'));
    if (authCode != '') {
        const res = await fetch('/creds', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: authCode })
        });
        let ans = await res.json();
        window.close();
    }
}

btn_auth.onclick = async () => {

    const resId = await fetch('/getclientid', {method: 'GET'});
    let ansId = await resId.json();

    const resPort = await fetch('/getdashboardport', {method: 'GET'});
    let ansPort = await resPort.json();

    let codeReqStr =
        'https://id.twitch.tv/oauth2/authorize?client_id='
        + ansId.clientId
        + '&redirect_uri='
        + 'http://localhost:' + ansPort.port
        + '&response_type=code&scope='
        + 'channel:read:redemptions'

    window.open(codeReqStr, '_blank').focus();
}