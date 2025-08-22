const outputContainer = document.getElementById('output-container');
let commandParser;

let devices = [];
let commands = [
    "route",
    "scan",
];

window.onload = function() {
    outputContainer.innerHTML = `<p>Welcome to the SysAdmin Simulator!</p>`;
    outputContainer.innerHTML += `<p>Type 'help' for a list of commands.</p>`;

    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'lime';

    let startingRouter = new Router();
    commandParser = new CommandParser(commands);
    devices.push(startingRouter);
    outputContainer.innerHTML += `<p>Router initialized.</p>`;
    outputContainer.innerHTML += `<p>Discover devices with 'scan'.</p>`;
};

class Router {
    constructor() {
        this.deviceName = 'michael5';
        this.routes = [];
        this.hardwareID = Math.floor(Math.random() * 99900)+100;
        this.type = 'router';
    }

    addRoute(destination, gateway) {
        let number = this.routes.length + 1;
        this.routes.push({ destination, gateway, number });
        outputContainer.innerHTML += `<p>Added route: ${destination} via ${gateway} on ${this.hardwareID}</p>`;
    }

    deleteRoute(number) {
        if (number < this.routes.length && number > 0) {
            this.routes = this.routes.filter(route => route.number !== number);
            outputContainer.innerHTML += `<p>Deleted route: ${number}</p>`;
        }
    }

    listRoutes() {
        if (this.routes.length === 0) {
            outputContainer.innerHTML += `<p>No routes available.</p>`;
        } else {
            outputContainer.innerHTML += `<p>Current routes (${this.hardwareID}):</p>`;
            this.routes.forEach(route => {
                outputContainer.innerHTML += `<p>${route.destination} via ${route.gateway} (${route.number})</p>`;
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
            // Add new commands here, e.g. 'theme': this.handleTheme
        };
    }

    parse(command) {
        const tokens = command.split(' ');
        const commandName = tokens[0];
        const args = tokens.slice(1);

        outputContainer.innerHTML += `<p>Cisco > ${command}</p>`;

        if (this.handlers[commandName]) {
            this.handlers[commandName].call(this, args);
        } else {
            outputContainer.innerHTML += `<p>Unknown command: ${commandName}</p>`;
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
                    outputContainer.innerHTML += "<p>Correct syntax: route add route-destination port-num router-hwid</p>";
                }
            }
        }
        else if (args[0] === 'del') {
            try {
                getDeviceByHWID(parseInt(args[2])).deleteRoute(parseInt(args[1]));
            } catch (error) {
                outputContainer.innerHTML += `<p>error</p>`;
            }
        } else if (args[0] === 'list' && args[1]) {
            try {
                getDeviceByHWID(parseInt(args[1])).listRoutes();
            } catch (error) {
                outputContainer.innerHTML += `<p>error</p>`;
            }
        }
    }

    handleScan(args) {
        devices.forEach(device => {
            outputContainer.innerHTML += `<p>${device.deviceName} - ${device.type} | hwid : ${device.hardwareID}</p>`;
        });
    }

    // Add more handler methods for new commands
}

document.getElementById('command').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = event.target.value.trim();
        if (command) {
            commandParser.parse(command);
            event.target.value = ''; // Clear the input after execution
        }
    }
});

function getDeviceByHWID(hwid) {
    return devices.find(device => device.hardwareID === hwid);
}