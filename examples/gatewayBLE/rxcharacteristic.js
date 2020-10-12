// Handler handles only single connection at a time.

//var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var bleno = require('../..');
var os = require('os');
var mutils = require('./myutils');

var BlenoCharacteristic = bleno.Characteristic;

var bs_name = os.hostname();
console.log("bs_name: " + bs_name);

var mqtt = require('mqtt');

// connect to the message server
var qclient = mqtt.connect('mqtt://localhost');
var dumpfile = 'dumps.json'

// terminate the client
//qclient.end();

var fs = require('fs');

function createAndAppend(filename, charset){
    fs.access(filename, fs.constants.F_OK | fs.constants.W_OK, function(err){
        if (err){
            fs.writeFile(filename, charset+"\n", function(e){
                console.log("write file error:", e)
            })
        }else{
            fs.appendFile(filename, charset+"\n", function(e){
                console.log("append file error:", e)
            })
        }
    })
}



var RXCharacteristic = function () {
    RXCharacteristic.super_.call(this, {
        uuid: mutils.device_id,
        properties: ['write', 'writeWithoutResponse'],
        value: null
    });

    this._value = new Buffer(0);
    this._updateValueCallback = null;
};

util.inherits(RXCharacteristic, BlenoCharacteristic);

var resArray = [];
var connectDate;


RXCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    this._value = data;
    console.log(data)
    resArray.push(data);
    callback(this.RESULT_SUCCESS);
};

function getBeanName(peripheral) {
    console.log(peripheral);
    return parseInt(peripheral.substring(15, 17), 16);//
}

bleno.on('accept', function (clientAddress) {
    console.log('---------------------------------');
    var sBean = getBeanName(clientAddress);
    connectDate = new Date();
    console.log("connected to: " + sBean + " at " + connectDate);
});

bleno.on('disconnect', function (clientAddress) {
    var _resArray = resArray;
    resArray = [];
    if (!(_resArray.length > 0 && _resArray[0])) return console.log('ERROR: Empty dump');
    console.log("size: " + _resArray.length);

    var sBean = getBeanName(clientAddress);


    var _connectDate = connectDate; //it's done due to the race condition, so that original timestamp does not get changed.

    /*if (res_array.length > 0 && res_array[0]) {
        console.log("first_prefix: " + res_array[0].toString('hex'));
    } else {
        console.log("ERROR! empty dump");
        return;
    }*/


    var index_counter = _resArray[0][0];
    var bad_connections = _resArray[0][1];
    // console.log('index_counter: ' + index_counter + ', bad_connections: ' + bad_connections);
    //disregard first element of the array since it's the hack for protocol2.0
    _resArray.splice(0, 1);

    var resSum = Buffer.concat(_resArray);

    var retJSON = [];
    if (resSum.length % 3 !== 0) return console.log("ERROR DISCARD invalid DUMP!!!");


    for (var i = 0; i < resSum.length; i += 3) {
        console.log({'beanId': resSum[i], 'rssi': resSum[i + 1] - 255, 'tick': resSum[i + 2], 'timestamp': null});
        retJSON.push({'beanId': resSum[i], 'rssi': resSum[i + 1] - 255, 'tick': resSum[i + 2], 'timestamp': null});
    }

    // publish 'Hello mqtt' to 'test'
    var json_dump = JSON.stringify({
        'from': sBean,
        'index': index_counter,
        'by_bs': bs_name,
        'timestamp': _connectDate.getTime(),
        'data': retJSON
    });
    qclient.publish('dumps', json_dump, {qos: 2});

    //save backup to file
    createAndAppend("dumps.json", json_dump);


    /*
    var db = mymongo.getDB();
        db.save({
          'from': _sBean,
          'index': index_counter,
          'by': bs_name,
          'timestamp': dumps_timestamp,
          'data': ret_json
        }, function (err, doc) {
          //console.log(data);
          if (err) throw err;
          console.log('saved into db');
        });
     
*/

    console.log("disconnected from: " + sBean + " at " + new Date());
});


module.exports = RXCharacteristic;

