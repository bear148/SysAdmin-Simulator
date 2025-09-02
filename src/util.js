import { Connection } from "./ethernet.js";

const outputContainer = get('output-container');

function getDeviceByHWID(hwid) {
    return devices.find(device => device.hardwareID === hwid);
}

function printToConsole(message, type) {
    outputContainer.innerHTML += `<p class="${type}">${message}</p>`;
}

function generateRandomHWID() {
    return Math.floor(Math.random() * 99900) + 100;
}

function establishConnection(d1, d2) {
    if ((d2 && d1 !== d2) && (!d1.connected && !d2.connected)) {
        d1.connected = true;
        d2.connected = true;

        let c = new Connection(d1, d2);
        connections.push(c);

        printToConsole(`Connection established from ${d1.hardwareID} to ${d2.hardwareID} (${d1.deviceName} -> ${d2.deviceName}).`, messageType.INFO);
    } else {
        printToConsole(`error`, messageType.ERROR);
    }
}

function get(id) {
    return document.getElementById(id);
}

export {
    getDeviceByHWID,
    printToConsole,
    generateRandomHWID,
    establishConnection,
    get
};