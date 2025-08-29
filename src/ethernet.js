export class EthernetPort {
    constructor(hardwareID, deviceName="ethernet-port") {
        this.hardwareID = hardwareID;
        this.deviceName = deviceName;
        this.type = 'eth-port';
        this.connected = false;
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
        this.connected = false;
        device.ports.push(this);
    }
}