import { devices, connections, activeConnections, messageType } from "./index.js";
import { getDeviceByHWID, printToConsole, establishConnection } from "./util.js";

export class CommandParser {
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
        switch (args[0]) {
            case 'device':
                getDeviceByHWID(parseInt(args[1])).listPorts();
                break;
            // Add more subcommands as needed
            default:
                printToConsole(`Unknown subcommand for ethport: ${args[0]}`, messageType.ERROR);
                break;
        }
    }
}