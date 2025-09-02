import { Device } from "./device.js";
import { DevicePort } from "./ethernet.js";
import { printToConsole, generateRandomHWID } from "./util.js";
import { messageType } from "./index.js";

export class Router extends Device {
    constructor() {
        super("michael5", "router");
        this.deviceName = 'michael5';
        this.routes = [];
        this.ports = [];

        this.generatePorts(4);
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

    listPorts() {
        if (this.ports.length === 0) {
            printToConsole(`No ports available.`);
        } else {
            printToConsole(`Current ports (${this.hardwareID}):`);
            this.ports.forEach(port => {
                printToConsole(`Port ${port.portNumber} - Type: ${port.portType} - Connected: ${port.connected}`, messageType.INFO);
            });
        }
    }

    generatePorts(count) {
        for (let i = 0; i < count; i++) {
            new DevicePort("RJ45", i, this);
        }
    }
}