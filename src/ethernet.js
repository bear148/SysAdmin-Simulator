import { Device } from "./device.js";

export class EthernetPort extends Device {
    constructor(hardwareID, deviceName="ethernet-port") {
        super(deviceName, 'eth-port');
    }
}

export class Connection {
    constructor(fromDevice, toDevice) {
        this.from = fromDevice;
        this.to = toDevice;
    }
}

export class DevicePort {
    constructor(portType, portNumber, device) {
        this.portType = portType;
        this.portNumber = portNumber;
        this.connected = null;
        device.ports.push(this);
    }
}