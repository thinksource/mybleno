var util = require('util');

var bleno = require('../..');

var BlenoCharacteristic = bleno.Characteristic;

var TXCharacteristic = function() {
  TXCharacteristic.super_.call(this, {
    uuid: '6E400002B5A3F393E0A9E50E24DCCA9E',
    properties: ['notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(TXCharacteristic, BlenoCharacteristic);

TXCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('TXCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};
TXCharacteristic.prototype.onUnsubscribe = function() {
  console.log('TXCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = TXCharacteristic;
