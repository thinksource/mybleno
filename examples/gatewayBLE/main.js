var bleno = require('../..');
var mutils = require('./myutils') 
//var mymongo = require('/root/gatewayBLE/examples/gatewayBLE/mymongo');

var BlenoPrimaryService = bleno.PrimaryService;

var RXCharacteristic = require('./rxcharacteristic');

//var TXCharacteristic = require('./txcharacteristic');


console.log('bleno - echo');
console.log("bs_name: " + mutils.hostname);
console.log("uuid:", mutils.device_id);
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(mutils.hostname, [mutils.device_id]);
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
	uuid: mutils.device_id,
	characteristics: [
	  receiveHandler //new RXCharacteristic() //, new TXCharacteristic()
	]
      })
    ]);
  }
});
