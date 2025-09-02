import { EthernetPort } from './ethernet.js';
import { Router } from './router.js';
import { printToConsole, generateRandomHWID } from './util.js';
import { CommandParser } from './parser.js';

// let commandHistory = [];
let commandParser;

let connections = [];
let activeConnections = 0;

let messageType = {
    INFO: 'i',
    ERROR: 'e',
}

let devices = [];
let commands = [
    "route",
    "scan",
];

let lastTime = 0;
let accumulatedTime = 0;
const TIME_STEP = 1000 / 60;

window.onload = function () {
    printToConsole(`Welcome to the SysAdmin Simulator!`);
    printToConsole(`Type 'help' for a list of commands.`);

    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'lime';

    let startingRouter = new Router();
    let startingEthPort = new EthernetPort(generateRandomHWID(), "eth0");

    commandParser = new CommandParser(commands);

    devices.push(startingRouter);
    devices.push(startingEthPort);

    printToConsole(`Discover devices with 'scan'.`);
    printToConsole(`Scan for open ethernet ports with 'ethport'.`);
};

/* 

Be sure to uncomment once I add economic features. Not sure how I will structure the economy system yet.
Will probably be on how many active connections you have, devices you own, operating costs, network efficiency/traffic, etc.

*/

// function GameLoop(timestamp) {
//     if (!lastTime) lastTime = timestamp;

//     let deltaTime = timestamp - lastTime;
//     lastTime = timestamp;
//     accumulatedTime += deltaTime;

//     while (accumulatedTime >= TIME_STEP) {
//         console.log('tick');
//         accumulatedTime -= TIME_STEP;
//     }

//     requestAnimationFrame(GameLoop);
// }

// requestAnimationFrame(GameLoop);

document.getElementById('command').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = event.target.value.trim();
        if (command) {
            commandParser.parse(command);
            event.target.value = ''; // Clear the input after execution
        }
    }
});

export { devices, connections, activeConnections, messageType }; 