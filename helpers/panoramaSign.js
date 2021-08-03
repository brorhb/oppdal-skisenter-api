/**
 * Telegram structure:
 * [STX][CMD][data][CRC][ETX]
 */


// TODO: Bestemme om det skal det opprettes en connection til server som holdes åpen eller ny for vær pakke som skal sendes?
// TODO: 
const net = require('net');
const { send } = require('process');

// Temp
const PORT = 10029, HOST = '127.0.0.1';

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

const updateAvalancheRed = () => {
    const CMD = 0x33;
    const GREEN = 0x31;
    const YELLOW = 0x32;
    const RED = 0x33;
    sendPacket(CMD, RED);
}

const updateAvalancheGreen = () => {
    const CMD = 0x33;
    const GREEN = 0x31;
    const YELLOW = 0x32;
    const RED = 0x33;
    sendPacket(CMD, GREEN);
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
    let buffer = Buffer.from(packet);
    

    let client = new net.Socket();
    client.connect(PORT, HOST, function() {
        console.log("Connected to panorama sign. Sending packet ", packet);
        client.write(buffer);
    });
    client.on('data', function(data) {
        console.log("data type", typeof data)
        try {console.log("as json string", JSON.stringify(data))} catch {}
        if (typeof data === Buffer) {
            console.log("size", data.length)
        }
        console.log("Recieved data:", `${data}`);
        let b = Buffer.from('[object Object]', 'utf8')
        console.log("buffer as string", b.toString('utf8'))
        client.destroy();
        // TODO: check if data is ACK or NACK, and handle accordingly
    });
}

function testPanoramaSign() {
    //clearDisplay();

    //updateSlopes('ggggggggggggggggggggggggggggggggggggggggggggg')

    //updateLifts('rrrgggggggggggggggggggggggggggggggggggggggggg')

    //updateRTC("1330");

    //setAllRelays(true)
}

module.exports = {clearDisplay, updateSlopes, updateLifts, updateAvalancheRed, updateAvalancheGreen, updateRTC, setAllRelays}