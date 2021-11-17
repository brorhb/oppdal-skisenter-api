/**
 * Telegram structure:
 * [STX][CMD][data][CRC][ETX]
 */
const net = require('net');
const characterToHex = require('./characterToHex');

const PORTS = [10029, 10030, 10031, 10032],
  HOST = '93.89.113.12';
const STX = 0x02,
  ETX = 0x04,
  ACK = 0x06,
  NACK = 0x15,
  CRC = 0x00;

const sendTelegram = async (telegram, port) => {
  return new Promise((resolve, reject) => {
    let hexVal = new Uint8Array(telegram);
    let client = net.Socket();
    client.connect(port, HOST, function () {
      console.log('Connected to ' + HOST + ':' + port);
      client.write(hexVal);
    });
    client.on('error', function (error) {
      console.log('FAILURE', `${error}`);
      client.destroy();
      reject(error);
    });
    client.on('data', function (data) {
      console.log(
        'SUCCESS',
        [...data].map((value) => value?.toString(16))
      );
      try {
        if (data[1].toString(16) == ACK) {
          client.end();
          resolve();
        } else if (data[1].toString(16) == NACK) {
          client.end();
          reject('NACK');
        } else if (data[0].toString(16) == ACK) {
          // TODO: Når avalanche oppdateres svarer tavle med <Buffer CTX>, og så ny melding med <Buffer ACK, CMD....>. Finne ut hvorfor
          client.end();
          resolve();
        } else {
          client.end();
          resolve();
        }
      } catch (error) {
        client.destroy();
        reject(error);
      }
    });
  });
};

const billboardMessageConstructor = (message) => {
  message = message.split('').map((char) => characterToHex[char]);
  return [STX, 0x06, 0x14, 0x02, 0x07, ...message, CRC, ETX];
};

const updatePanoramaSign = async (telegram) => {
  let results = {};
  for (let i = 0; i < PORTS.length; i++) {
    try {
      await sendTelegram(telegram, PORTS[i]);
      results[PORTS[i]] = 'success';
    } catch (error) {
      results[PORTS[i]] = error;
    }
  }
  return results;
};

const avalancheTelegramConstructor = async (color) => {
  const CMD = 0x33;
  let data;
  switch (color) {
    case 0:
      data = 0x31; //green
      break;
    case 1:
      data = 0x32; //yellow
      break;
    case 2:
      data = 0x33; //red
      break;
    case 3:
      data = 0x30; // off
      break;
    default:
      data = undefined;
      break;
  }
  if (data === undefined) return false;
  const telegram = [STX, CMD, data, CRC, ETX];
  return telegram;
};

const relaysTelegramConstructor = async (items) => {
  let arrays = await updateBillboards(items);
  let telegrams = [
    [STX, 0x31, ...arrays[0], CRC, ETX],
    [STX, 0x32, ...arrays[1], CRC, ETX],
  ];
  return telegrams;
};

const clearDisplayTelegramConstructor = async () => {
  const CMD = 0x30;
  return [STX, CMD, 0x00, CRC, STX];
};

const ledStates = {
  a: 0x61,
  g: 0x67,
  r: 0x72,
  1: 0x67,
  2: 0x72,
  3: 0x72,
};
const updateBillboards = (items) => {
  return new Promise(async (resolve, reject) => {
    var arr = [];
    items.forEach((item) => {
      position = JSON.parse(item['panorama_position']);
      let status = ledStates[item.status];
      if (arr[position[0]]) {
        arr[position[0]][position[1]] = status;
      } else {
        arr.push([]);
        arr[position[0]][position[1]] = status;
      }
    });
    for (var i = 0; i < arr.length; i++) {
      let clean = [];
      for (var y = 0; y < arr[i].length; y++) {
        let status = arr[i][y];
        if (status) clean.push(status);
        else clean.push(ledStates['a']);
      }
      arr[i] = clean;
    }
    resolve(arr);
  });
};

const setAllRelaysTelegramConstructor = async (state) => {
  const CMD = 0x43;
  const OFF = 0x30;
  const ON = 0x31;
  if (state) return [STX, CMD, ON, CRC, ETX];
  else return [STX, CMD, OFF, CRC, ETX];
};

module.exports = {
  updatePanoramaSign,
  avalancheTelegramConstructor,
  relaysTelegramConstructor,
  setAllRelaysTelegramConstructor,
  clearDisplayTelegramConstructor,
  billboardMessageConstructor,
};
