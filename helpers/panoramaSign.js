/**
 * Telegram structure:
 * [STX][CMD][data][CRC][ETX]
 */


// TODO: Bestemme om det skal det opprettes en connection til server som holdes åpen eller ny for vær pakke som skal sendes?
// TODO: 
const net = require('net');

// Temp
const PORT = 80, HOST = '0.0.0.0';

const STX = 0x02;
const ETX = 0x04;
const ACK = 0x06;
const NACK = 0x15;
const CRC = 0x00;

const clearDisplay = () => {
    const CMD = 0x30;
    sendPacket(CMD, 0x00);
}

const updateSlopes = (data) => {
    const CMD = 0x31;
    sendPacket(CMD, data);
}

const updateLifts = (data) => {
    const CMD = 0x32;
    sendPacket(CMD, data);
}

const updateAvalanche = () => {
    const CMD = 0x33;
    const GREEN = 0x31;
    const YELLOW = 0x32;
    const RED = 0x33;
}

const updateRTC = (data) => {
    // Example data: "1330"
    const CMD = 0x42;
    sendPacket(CMD, data);
}

const setAllRelays = (state) => {
    const CMD = 0x43;
    const OFF = 0x30;
    const ON = 0x31;
    state ? sendPacket(CMD, ON) : sendPacket(CMD, OFF);
}

const sendPacket = (cmd, data) => {
    let packet = [STX, cmd, data, CRC, ETX];

    let client = new net.Socket();
    client.connect(PORT, HOST, function() {
        console.log("Connected to panorama sign. Sending packet ", packet);
        client.write(packet);
    });
    client.on('data', function(data) {
        client.destroy();
        // TODO: check if data is ACK or NACK, and handle accordingly
    });
}