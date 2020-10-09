var bleno = require('../..');
//var mymongo = require('/root/gatewayBLE/examples/gatewayBLE/mymongo');

var BlenoPrimaryService = bleno.PrimaryService;

var RXCharacteristic = require('./rxcharacteristic');
//var TXCharacteristic = require('./txcharacteristic');

console.log('bleno - echo');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('echo', ['6E400001B5A3F393E0A9E50E24DCCA9E']);
  } else {
    bleno.stopAdvertising();
  }
});

var receiveHandler = new RXCharacteristic();

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
	uuid: '6E400001B5A3F393E0A9E50E24DCCA9E',
	characteristics: [
	  receiveHandler //new RXCharacteristic() //, new TXCharacteristic()
	]
      })
    ]);
  }
});
