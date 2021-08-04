/**
 * Telegram structure:
 * [STX][CMD][PAR1][PAR2][PAR3][data][CRC][ETX]
 */

const net = require('net');
const PORT = 10029, HOST = '127.0.0.1';

const STX = 0x02, CRC = 0x00, ETX = 0x04, ACK = 0x06, NACK = 0x15;


const setTextBuffer = (message) => {
    
    const cmd = 0x06;
    const time = 0x14;
    const char = 0x02;
    const fixed = 0x07;
    let arr = [cmd, time, char, fixed];
    for(let i = 0; i < message.length; i++){
        arr.push(message.charCodeAt(i).toString(16));
    }
    arr.push(CRC);
    arr.push(ETX);
    sendPacket(arr);
}

const setBrightness = (brightness) => {
    const CMD = 0x21;
    if(brightness >= 1 && brightness <= 10) sendPacket(CMD, brightness.toString(16), 0x00, 0x00, 0x00);
    else console.log("Invalid brightness value ", brightness);
}

const setScrollingSpeed = (speed) => {
    const CMD = 0x20;
    if(speed >= 1 && brightness <= 10) sendPacket(CMD, speed.toString(16), 0x00, 0x00, 0x00);
    else console.log("Invalid speed value ", speed);
}

const setTime = (time) => {
    const CMD = 0x22;
    sendPacket(CMD, 0x00, 0x00, 0x00, time);
}



const sendPacket = (packet) => {
    let hexVal = new Uint8Array(packet);
    let client = new net.Socket();
    client.connect(PORT, HOST, function() {
        console.log("Connected to panorama sign. Sending packet ", hexVal);
        client.write(hexVal);
    });
    client.on('data', function(data) {
        client.destroy();
        // TODO: check if data is ACK or NACK and handle accordingly
    });
}
module.exports = {setTextBuffer}