/**
 * Telegram structure:
 * [STX][CMD][data][CRC][ETX]
 */

// TODO: Bestemme om det skal det opprettes en connection til server som holdes åpen eller ny for vær pakke som skal sendes?
// TODO: 
const getDataFromTable = require('./getDatabaseTable')
const net = require('net');

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
    const testData = 0x6f;
    sendPacket(CMD, testData);
}
const ledStates = {
    "a": 0x61,
    "g": 0x67,
    "r": 0x72,
    1: 0x67,
    2: 0x72,
    3: 0x72
}
const updateBillboards = () => {
    return new Promise(async (resolve, reject) => {
        let lifts = await getDataFromTable("lifts")
        let tracks = await getDataFromTable("tracks")
        let facilities = await getDataFromTable("facilities")

        var arr = []
        var items = [...lifts, ...tracks]
        items.forEach(item => {
            position = JSON.parse(item["panorama_position"])
            let status = ledStates[item.status]
            if (arr[position[0]]) {
                arr[position[0]][position[1]] = status
            } else {
                arr.push([])
                arr[position[0]][position[1]] = status
            }
        })
        for (var i = 0; i < arr.length; i++) {
            let clean = []
            for (var y = 0; y < arr[i].length; y++) {
                let status = arr[i][y]
                if (status) clean.push(status)
                else clean.push(ledStates["a"])
            }
            arr[i] = clean
        }
        resolve(arr)
    })
}


const updateLifts = async (data) => {
    /**
     * push 103 og 114 => ingenting skjer
     * push 0x67 og 0x72 => alle blir mørke
     * push 'g' og 'r' 0> ingenting skjer
     * push 0x67 og 0x61  => DETTE FUNKER - 4ern grønn tavla venstre fungerer ikke
     */
    /*
    let arr = [];
    data.forEach(lift => {
        if(lift.status == 1) arr.push(0x67);
        else arr.push(0x72);
    })
    
    const CMD = 0x32;

    */
    let arr = await updateBillboards();
    console.log(arr);
    
    await sendPacket(0x31, arr[0]);
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
    //await sendPacket(0x32, arr[1]);
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
    return new Promise((resolve, reject) => {
        //let packet = [STX, cmd, data, CRC, ETX];
        let packet = [STX, cmd];
        data.forEach(e => {
            packet.push(e);
        });
        packet.push(CRC);
        packet.push(ETX);
        let hexVal = new Uint8Array(packet);
        let client = new net.Socket();
        client.connect(PORT, HOST, function() {
            console.log("Connected to panorama sign. Sending packet ", hexVal);
            client.write(hexVal);            
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
            console.log("response ", data);
            // TODO: check if data is ACK or NACK, and handle accordingly
            client.end();
            resolve();
        });
        client.on('error', function(error) {
            console.log("error from client", error);
            client.end();
            reject(error);
        })
    })
}

function testPanoramaSign() {
    //clearDisplay();

    //updateSlopes('ggggggggggggggggggggggggggggggggggggggggggggg')

    //updateLifts('rrrgggggggggggggggggggggggggggggggggggggggggg')

    //updateRTC("1330");

    //setAllRelays(true)
}

module.exports = {clearDisplay, updateSlopes, updateLifts, updateAvalancheRed, updateAvalancheGreen, updateRTC, setAllRelays}