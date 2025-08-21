const outputContainer = document.getElementById('output-container');
let devices = [];

window.onload = function() {
    outputContainer.innerHTML = `<p>Welcome to the SysAdmin Simulator!</p>`;
    outputContainer.innerHTML += `<p>Type 'help' for a list of commands.</p>`;

    let startingRouter = new Router();
    devices.push(startingRouter);
    outputContainer.innerHTML += `<p>Router initialized.</p>`;
    outputContainer.innerHTML += `<p>Type 'route add <destination> <gateway>' to add a route.</p>`;
    outputContainer.innerHTML += `<p>Type 'route del <destination>' to delete a route.</p>`;
    outputContainer.innerHTML += `<p>Type 'route list' to list all routes.</p>`;
    outputContainer.innerHTML += `<p>Type 'help' to see available commands.</p>`;
    outputContainer.innerHTML += `<p>Starting Router HWID: ${devices[0].hardwareID}</p>`;
};

class Router {
    constructor() {
        this.routes = [];
        this.hardwareID = Math.floor(Math.random() * 99900)+100;
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
            outputContainer.innerHTML += `<p>Current routes:</p>`;
            this.routes.forEach(route => {
                outputContainer.innerHTML += `<p>${route.destination} via ${route.gateway} (${route.number})</p>`;
            });
        }
    }
}

document.getElementById('command').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = event.target.value.trim();
        if (command) {
            executeCommand(command);
            event.target.value = ''; // Clear the input after execution
        }
    }
});

function executeCommand(command) {
    const tokens = command.split(' ');
    const commandName = tokens[0];
    const args = tokens.splice(1);
    switch (commandName) {
        case 'route':
            if (args[0] === 'add') {
                let destination = args[1];
                let gateway = args[2];
                let hwid = args[3] || devices[0].hardwareID; // Default to first device's HWID if not provided
                if (destination && gateway) {
                    getDeviceByHWID(parseInt(hwid)).addRoute(destination, gateway);
                }
            }
            else if (args[0] === 'del') {
                getDeviceByHWID(parseInt(args[2])).deleteRoute(parseInt(args[1]));
            } else if (args[0] === 'list' && args[1]) {
                getDeviceByHWID(parseInt(args[1])).listRoutes();
            }
            break;
        // case 'cat':
        //     break;
    }
}

function getDeviceByHWID(hwid) {
    return devices.find(device => device.hardwareID === hwid);
}