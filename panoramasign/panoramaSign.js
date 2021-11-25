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

const temperatureTelegramConstructor = async () => {
  const CMD = 0x24;
  return [STX, CMD, CRC, ETX];
};

const sendTelegram = async (telegram, port) => {
  return new Promise((resolve, reject) => {
    let client = net.createConnection({ port: port, host: HOST }, () => {
      client.write(telegram);
    });
    client.on('error', function (error) {
      console.log('FAILURE', `${error}`);
      client.end();
      reject(error);
    });
    client.on('data', function (data) {
      try {
        client.end();
        resolve([...data]);
      } catch (error) {
        client.destroy();
        reject(error);
      }
    });
    client.on('end', () => {
      console.log('Disconnected from ' + HOST + ':' + port);
    });
  });
};

const sendMessageTelegram = async (telegrams, port) => {
  return new Promise((resolve, reject) => {
    let numberOfTelegrams = telegrams.length - 1;
    let telegramCounter = 0;
    let client = net.createConnection({ port: port, host: HOST }, () => {
      console.log('Connected to ' + HOST + ':' + port);
      console.log('Sending telegram...', telegrams[telegramCounter]);
      client.write(new Uint8Array(telegrams[telegramCounter]));
      telegramCounter++;
    });
    client.on('error', function (error) {
      console.log('FAILURE', `${error}`);
      console.log('Ending');
      client.end();
      reject(error);
    });
    client.on('data', function (data) {
      try {
        if (telegramCounter <= numberOfTelegrams) {
          console.log('Sending telegram...', telegrams[telegramCounter]);
          client.write(new Uint8Array(telegrams[telegramCounter]));
          telegramCounter++;
        } else {
          resolve(telegrams);
          console.log('Ending');
          resolve([...data]);
          client.end();
        }
      } catch (error) {
        console.log('Ending');
        reject(error);
        client.end();
      }
    });
    client.on('end', () => {
      console.log('Disconnected from ' + HOST + ':' + port);
    });
  });
};

const sendMessageToBillboards = async (telegrams) => {
  let results = {};
  for (let i = 0; i < PORTS.length; i++) {
    try {
      var messageResult = [];
      messageResult = await sendMessageTelegram(telegrams, PORTS[i]);
      results[PORTS[i]] = messageResult;
    } catch (error) {
      results[PORTS[i]] = error;
    }
  }
  return results;
};

const billboardMessageConstructor = (message) => {
  let messages = [];
  const end = [0x01, 0x04];
  const setup1 = [
    STX,
    0x06, // CMD
    0x08, // time message is viewed
    0x08, // Char set aka font size
    0x07, // fixed
    ...'     <h...'.split('').map((value) => characterToHex[value]),
    ...end,
  ];
  messages.push(setup1);
  const setup2 = [
    STX,
    0x08, // CMD
    0x08, // time message is viewed
    0x08, // Char set aka font size
    0x07, // fixed
    ...'    <t. '.split('').map((value) => characterToHex[value]),
    0xb0,
    0x43,
    ...end,
  ];
  messages.push(setup2);
  message = [
    STX,
    0x0a, // CMD
    0x08, // time message is viewed
    0x07, // Char set aka font size
    0x07, // fixed
    ...message.split('').map((value) => characterToHex[value]),
    ...end,
  ];
  messages.push(message);
  const empty1 = [STX, 0x06, 0x08, 0x07, 0x07, ...end];
  messages.push(empty1);
  const empty2 = [STX, 0x0c, 0x07, 0x07, 0x07, ...end];
  messages.push(empty2);
  const empty3 = [STX, 0x0d, 0x07, 0x07, 0x07, ...end];
  messages.push(empty3);
  const empty4 = [STX, 0x0e, 0x07, 0x07, 0x07, ...end];
  messages.push(empty4);
  const empty5 = [STX, 0x0f, 0x07, 0x07, 0x07, ...end];
  messages.push(empty5);
  const setScrollSpeed = [STX, 0x20, 0x14, 0x00, 0x00, ...end];
  messages.push(setScrollSpeed);
  const today = new Date();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const setTime = [
    STX,
    0x22,
    0x00,
    0x00,
    0x00,
    ...time.split('').map((char) => characterToHex[char]),
    ...end,
  ];
  messages.push(setTime);
  const setBrightness = [STX, 0x21, 0x15, 0x00, 0x00, ...end];
  messages.push(setBrightness);
  return messages;
};

const updatePanoramaSign = async (telegram) => {
  let results = {};
  for (let i = 0; i < PORTS.length; i++) {
    try {
      let result = await sendTelegram(new Uint8Array(telegram), PORTS[i]);
      results[PORTS[i]] = result;
    } catch (error) {
      results[PORTS[i]] = error;
    }
  }
  console.log(results);
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
  temperatureTelegramConstructor,
  sendMessageToBillboards,
};
