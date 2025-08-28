import { Connection, EthernetPort } from './ethernet.js';

const outputContainer = document.getElementById('output-container');
let commandParser;

let devices = [];
let commands = [
    "route",
    "scan",
];

let messageType = {
    INFO: 'i',
    ERROR: 'e',
}

let connections = [];
let activeConnections = 0;

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

class Router {
    constructor() {
        this.deviceName = 'michael5';
        this.routes = [];
        this.hardwareID = generateRandomHWID();
        this.type = 'router';
        this.connected = false;
    }

    addRoute(destination, gateway) {
        let number = this.routes.length + 1;
        this.routes.push({ destination, gateway, number });
        printToConsole(`Added route: ${destination} via ${gateway} on ${this.hardwareID}`, messageType.INFO);
    }

    deleteRoute(number) {
        if (number <= this.routes.length && number > 0) {
            this.routes = this.routes.filter(route => route.number !== number);
            printToConsole(`Deleted route: ${number}`, messageType.INFO);
        }
    }

    listRoutes() {
        if (this.routes.length === 0) {
            printToConsole(`No routes available.`);
        } else {
            printToConsole(`Current routes (${this.hardwareID}):`);
            this.routes.forEach(route => {
                printToConsole(`${route.destination} via ${route.gateway} (${route.number})`, messageType.INFO);
            });
        }
    }
}

class CommandParser {
    constructor(commands) {
        this.commands = commands;
        this.handlers = {
            route: this.handleRoute,
            scan: this.handleScan,
            connect: this.handleConnection,
            ethport: this.handleEthernetPorts,
            font: () => document.body.style.fontSize = '24px',
            // Add new commands here, e.g. 'theme': this.handleTheme
        };
    }

    parse(command) {
        const tokens = command.split(' ');
        const commandName = tokens[0];
        const args = tokens.slice(1);

        printToConsole(`Cisco > ${command}`);

        if (this.handlers[commandName]) {
            if (args.length < 1 && (commandName !== 'scan' && commandName !== 'font')) {
                printToConsole(`Not enough arguments for command: ${commandName}`, messageType.ERROR);
                return;
            }
            this.handlers[commandName].call(this, args);
        } else {
            printToConsole(`Unknown command: ${commandName}`, messageType.ERROR);
        }
    }

    handleRoute(args) {
        if (args[0] === 'add') {
            let destination = args[1];
            let gateway = args[2];
            let hwid = args[3] || devices[0].hardwareID;
            if (destination && gateway) {
                try {
                    getDeviceByHWID(parseInt(hwid)).addRoute(destination, gateway);
                } catch (error) {
                    printToConsole("Correct syntax: route add route-destination port-num router-hwid", messageType.ERROR);
                }
            }
        }
        else if (args[0] === 'del') {
            try {
                getDeviceByHWID(parseInt(args[2])).deleteRoute(parseInt(args[1]));
            } catch (error) {
                printToConsole(`error`, messageType.ERROR);
            }
        } else if (args[0] === 'list' && args[1]) {
            try {
                getDeviceByHWID(parseInt(args[1])).listRoutes();
            } catch (error) {
                printToConsole(`error`, messageType.ERROR);
            }
        }
    }

    handleScan(args) {
        devices.forEach(device => {
            printToConsole(`${device.deviceName} - ${device.type} | hwid : ${device.hardwareID}`, messageType.INFO);
        });

        if (connections.length === 0) return;

        connections.forEach(conn => {
            printToConsole(`Connection: ${conn.from.hardwareID} -> ${conn.to.hardwareID} (${conn.from.deviceName} -> ${conn.to.deviceName})`, messageType.INFO);
        });
    }

    handleConnection(args) {
        switch (args[0]) {
            case 'add':
                if (getDeviceByHWID(parseInt(args[1])) && getDeviceByHWID(parseInt(args[2]))) {
                    establishConnection(getDeviceByHWID(parseInt(args[1])), getDeviceByHWID(parseInt(args[2])));
                    activeConnections++;
                }
                break;
            case 'list':
                connections.forEach(conn => {
                    printToConsole(`${conn.from.hardwareID} -> ${conn.to.hardwareID} (${conn.from.deviceName} -> ${conn.to.deviceName})`, messageType.INFO);
                });
                break;
        }
    }

    handleEthernetPorts(args) {
        // Placeholder for ethernet port handling logic
        printToConsole(`Ethernet port command executed with args: ${args.join(' ')}`);
    }
}

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
            // commandHistory.push(command);
            // console.log(commandHistory);
            event.target.value = ''; // Clear the input after execution
        }
    }

    // if (event.key === 'ArrowUp') {
    //     console.log('up');
    //     event.preventDefault();
    //     if (commandHistory.length > 0) {
    //         event.target.value = commandHistory.pop();
    //     }
    // }
});

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

        printToConsole(`<p>Connection established from ${d1.hardwareID} to ${d2.hardwareID} (${d1.deviceName} -> ${d2.deviceName}).</p>`, messageType.INFO);
    } else {
        printToConsole(`<p>error</p>`, messageType.ERROR);
    }
}