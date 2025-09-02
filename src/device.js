import { generateRandomHWID } from "./util.js";

export class Device {
    constructor(name, type) {
        this.deviceName = name;
        this.hardwareID = generateRandomHWID();
        this.type = type;
        this.connected = false;
    }
}