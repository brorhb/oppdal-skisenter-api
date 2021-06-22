/**
 * Telegram structure:
 * [STX][CMD][PAR1][PAR2][PAR3][data][CRC][ETX]
 */

const net = require('net');

const STX = 0x02, CRC = 0x00, ETX = 0x04, ACK = 0x06, NACK = 0x15;


const setTextBuffer = (line, time, characterSet, text) => {
    let cmd, par2;
    let par1 = time.toString(16);
    let par3 = 0x07; //Fixed

    if(line >= 1 && line <= 10) cmd = line.toString(16);
    else return;

    if(characterSet >= 1 && characterSet <= 3) par2 = characterSet.toString(16);
    else return;
    
    sendPacket(cmd, par1, par2, par3, text);
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



const sendPacket = (cmd, par1, par2, par3, data) => {
    let packet = [STX, cmd, par1, par2, par3, data, CRC, ETX];

    let client = new net.Socket();
    client.connect(PORT, HOST, function() {
        console.log("Connected to panorama sign. Sending packet ", packet);
        client.write(packet);
    });
    client.on('data', function(data) {
        client.destroy();
        // TODO: check if data is ACK or NACK and handle accordingly
    });
}